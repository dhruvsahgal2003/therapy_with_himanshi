import { 
  type User, type InsertUser, 
  type Contact, type InsertContact,
  type Payment, type InsertPayment,
  type BookingToken, type InsertBookingToken
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createContact(contact: InsertContact): Promise<Contact>;
  getContacts(): Promise<Contact[]>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  getPaymentByOrderId(orderId: string): Promise<Payment | undefined>;
  updatePayment(orderId: string, data: Partial<Payment>): Promise<Payment | undefined>;
  createBookingToken(token: InsertBookingToken): Promise<BookingToken>;
  getBookingToken(token: string): Promise<BookingToken | undefined>;
  consumeBookingToken(token: string): Promise<BookingToken | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private contacts: Map<string, Contact>;
  private payments: Map<string, Payment>;
  private bookingTokens: Map<string, BookingToken>;

  constructor() {
    this.users = new Map();
    this.contacts = new Map();
    this.payments = new Map();
    this.bookingTokens = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const contact: Contact = {
      ...insertContact,
      id,
      createdAt: new Date(),
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async getContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values());
  }

  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const id = randomUUID();
    const payment: Payment = {
      id,
      razorpayOrderId: insertPayment.razorpayOrderId,
      razorpayPaymentId: insertPayment.razorpayPaymentId ?? null,
      razorpaySignature: insertPayment.razorpaySignature ?? null,
      amount: insertPayment.amount,
      currency: insertPayment.currency ?? "INR",
      status: insertPayment.status ?? "created",
      email: insertPayment.email ?? null,
      phone: insertPayment.phone ?? null,
      serviceName: insertPayment.serviceName,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.payments.set(payment.razorpayOrderId, payment);
    return payment;
  }

  async getPaymentByOrderId(orderId: string): Promise<Payment | undefined> {
    return this.payments.get(orderId);
  }

  async updatePayment(orderId: string, data: Partial<Payment>): Promise<Payment | undefined> {
    const payment = this.payments.get(orderId);
    if (!payment) return undefined;
    
    const updated: Payment = {
      ...payment,
      ...data,
      updatedAt: new Date(),
    };
    this.payments.set(orderId, updated);
    return updated;
  }

  async createBookingToken(insertToken: InsertBookingToken): Promise<BookingToken> {
    const id = randomUUID();
    const token: BookingToken = {
      ...insertToken,
      id,
      consumedAt: null,
      createdAt: new Date(),
    };
    this.bookingTokens.set(token.token, token);
    return token;
  }

  async getBookingToken(token: string): Promise<BookingToken | undefined> {
    const bookingToken = this.bookingTokens.get(token);
    if (!bookingToken) return undefined;
    
    if (new Date() > bookingToken.expiresAt) {
      return undefined;
    }
    
    return bookingToken;
  }

  async consumeBookingToken(token: string): Promise<BookingToken | undefined> {
    const bookingToken = this.bookingTokens.get(token);
    if (!bookingToken) return undefined;
    
    if (new Date() > bookingToken.expiresAt) {
      return undefined;
    }
    
    if (bookingToken.consumedAt) {
      return undefined;
    }
    
    const updated: BookingToken = {
      ...bookingToken,
      consumedAt: new Date(),
    };
    this.bookingTokens.set(token, updated);
    return updated;
  }
}

export const storage = new MemStorage();
