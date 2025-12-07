import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const contacts = pgTable("contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  razorpayOrderId: text("razorpay_order_id").notNull().unique(),
  razorpayPaymentId: text("razorpay_payment_id"),
  razorpaySignature: text("razorpay_signature"),
  amount: integer("amount").notNull(),
  currency: text("currency").notNull().default("INR"),
  status: text("status").notNull().default("created"),
  email: text("email"),
  phone: text("phone"),
  serviceName: text("service_name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const bookingTokens = pgTable("booking_tokens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  paymentId: varchar("payment_id").notNull().references(() => payments.id),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  consumedAt: timestamp("consumed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBookingTokenSchema = createInsertSchema(bookingTokens).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;
export type InsertBookingToken = z.infer<typeof insertBookingTokenSchema>;
export type BookingToken = typeof bookingTokens.$inferSelect;

export const services = [
  {
    id: "individual-therapy",
    title: "One-on-One Therapy",
    description: "Personalized individual sessions to explore your thoughts and feelings in a safe space.",
    duration: 60,
    price: 1000,
  },
  {
    id: "anxiety-stress",
    title: "Anxiety & Stress Management",
    description: "Evidence-based strategies to manage anxiety, reduce stress, and regain control.",
    duration: 60,
    price: 1000,
  },
  {
    id: "relationship-counseling",
    title: "Relationship Counseling",
    description: "Navigate complex relationship dynamics and improve communication with your partner.",
    duration: 60,
    price: 1000,
  },
  {
    id: "teen-young-adult",
    title: "Teen/Young Adult Therapy",
    description: "Specialized support for the unique challenges faced by teenagers and young adults.",
    duration: 60,
    price: 1000,
  },
  {
    id: "online-session",
    title: "Online Session",
    description: "Flexible therapy sessions from the comfort of your own home via secure video call.",
    duration: 60,
    price: 1000,
  },
] as const;

export type ServiceType = typeof services[number];
