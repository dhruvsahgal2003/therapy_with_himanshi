import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, services } from "@shared/schema";
import Razorpay from "razorpay";
import crypto from "crypto";

let razorpayInstance: Razorpay | null = null;

function getRazorpay(): Razorpay | null {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return null;
  }
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
}

function generateBookingToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);
      res.status(201).json(contact);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/services", async (req, res) => {
    res.json(services);
  });

  app.post("/api/payments/create-order", async (req: Request, res: Response) => {
    try {
      const { serviceId, email, phone } = req.body;

      const razorpay = getRazorpay();
      if (!razorpay) {
        return res.status(500).json({ error: "Payment gateway not configured" });
      }

      const service = services.find((s) => s.id === serviceId);
      if (!service) {
        return res.status(400).json({ error: "Invalid service selected" });
      }

      const order = await razorpay.orders.create({
        amount: service.price * 100,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        notes: {
          serviceId: service.id,
          serviceName: service.title,
        },
      });

      await storage.createPayment({
        razorpayOrderId: order.id,
        amount: service.price,
        serviceName: service.title,
        email: email || null,
        phone: phone || null,
        status: "created",
      });

      res.json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
        serviceName: service.title,
        serviceDuration: service.duration,
      });
    } catch (error: any) {
      console.error("Error creating order:", error);
      res.status(500).json({ error: "Failed to create payment order" });
    }
  });

  app.post("/api/payments/verify", async (req: Request, res: Response) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ error: "Missing payment details" });
      }

      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
        .update(body)
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ error: "Invalid payment signature" });
      }

      const payment = await storage.getPaymentByOrderId(razorpay_order_id);
      if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
      }

      await storage.updatePayment(razorpay_order_id, {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: "paid",
      });

      const bookingToken = generateBookingToken();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await storage.createBookingToken({
        paymentId: payment.id,
        token: bookingToken,
        expiresAt,
      });

      res.cookie("booking_token", bookingToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.json({
        success: true,
        bookingToken,
        message: "Payment verified successfully",
      });
    } catch (error: any) {
      console.error("Error verifying payment:", error);
      res.status(500).json({ error: "Failed to verify payment" });
    }
  });

  app.get("/api/book/access", async (req: Request, res: Response) => {
    try {
      const token = req.cookies?.booking_token || req.query.token;

      if (!token) {
        return res.status(401).json({ 
          authorized: false, 
          error: "No booking token provided. Please complete payment first." 
        });
      }

      const bookingToken = await storage.getBookingToken(token);

      if (!bookingToken) {
        return res.status(401).json({ 
          authorized: false, 
          error: "Invalid or expired booking token. Please complete payment first." 
        });
      }

      res.json({
        authorized: true,
        calLink: "https://cal.com/himanshi-sahni/60min",
      });
    } catch (error: any) {
      console.error("Error checking booking access:", error);
      res.status(500).json({ error: "Failed to check booking access" });
    }
  });

  app.post("/api/book/consume", async (req: Request, res: Response) => {
    try {
      const token = req.cookies?.booking_token || req.body.token;

      if (!token) {
        return res.status(401).json({ error: "No booking token provided" });
      }

      const consumedToken = await storage.consumeBookingToken(token);

      if (!consumedToken) {
        return res.status(400).json({ error: "Token already used or expired" });
      }

      res.clearCookie("booking_token");
      res.json({ success: true, message: "Booking token consumed" });
    } catch (error: any) {
      console.error("Error consuming token:", error);
      res.status(500).json({ error: "Failed to consume token" });
    }
  });

  return httpServer;
}
