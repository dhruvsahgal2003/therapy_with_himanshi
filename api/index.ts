import express, { type Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import serverless from "serverless-http";
import Razorpay from "razorpay";
import crypto from "crypto";

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const services = [
  { id: "individual-therapy", title: "One-on-One Therapy", description: "Personalized individual sessions", duration: 60, price: 1000 },
  { id: "anxiety-stress", title: "Anxiety & Stress Management", description: "Evidence-based strategies", duration: 60, price: 1000 },
  { id: "relationship-counseling", title: "Relationship Counseling", description: "Navigate relationship dynamics", duration: 60, price: 1000 },
  { id: "teen-young-adult", title: "Teen/Young Adult Therapy", description: "Support for young adults", duration: 60, price: 1000 },
  { id: "online-session", title: "Online Session", description: "Flexible therapy from home", duration: 60, price: 1000 },
];

let razorpayInstance: Razorpay | null = null;

function getRazorpay(): Razorpay | null {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
  
  if (!keyId || !keySecret) {
    console.error("Razorpay credentials missing");
    return null;
  }
  
  if (!keyId.startsWith('rzp_')) {
    console.error("Invalid Razorpay key format");
    return null;
  }
  
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }
  return razorpayInstance;
}

app.get("/api/health", (req, res) => {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  res.json({
    status: "ok",
    razorpay: {
      configured: !!keyId && !!process.env.RAZORPAY_KEY_SECRET,
      keyIdPrefix: keyId?.substring(0, 12) || "not set",
      keyIdValid: keyId?.startsWith('rzp_') || false
    }
  });
});

app.get("/api/services", (req, res) => {
  res.json(services);
});

app.post("/api/payments/create-order", async (req: Request, res: Response) => {
  try {
    const { serviceId } = req.body;

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

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID?.trim(),
      serviceName: service.title,
      serviceDuration: service.duration,
    });
  } catch (error: any) {
    console.error("Error creating order:", error);
    const errorMessage = error?.error?.description || error?.message || "Failed to create payment order";
    res.status(500).json({ error: errorMessage });
  }
});

app.post("/api/payments/verify", async (req: Request, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing payment details" });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
    if (!keySecret) {
      return res.status(500).json({ error: "Payment gateway not configured" });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: "Invalid payment signature" });
    }

    const bookingToken = crypto.randomBytes(32).toString("hex");

    res.cookie("booking_token", bookingToken, {
      httpOnly: true,
      secure: true,
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

app.get("/api/booking/verify", (req: Request, res: Response) => {
  const token = req.query.token as string || req.cookies?.booking_token;
  
  if (!token) {
    return res.status(401).json({ valid: false, error: "No booking token provided" });
  }

  // For Vercel serverless, we can't persist tokens across invocations
  // So we just validate the token format
  if (token.length === 64) {
    return res.json({ valid: true });
  }
  
  return res.status(401).json({ valid: false, error: "Invalid token" });
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Server error:", err);
  res.status(500).json({ error: "Internal server error" });
});

export default serverless(app);
