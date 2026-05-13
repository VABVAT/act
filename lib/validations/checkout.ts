import { z } from "zod";

export const checkoutLineItemSchema = z.object({
  productId: z.uuid(),
  quantity: z.coerce.number().int().min(1).max(10),
  selectedSize: z.string().trim().min(1),
});

export const shippingAddressSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required."),
  phone: z
    .string()
    .trim()
    .min(10, "Enter a valid phone number.")
    .max(15, "Enter a valid phone number."),
  email: z.email().trim(),
  addressLine1: z.string().trim().min(8, "Address is required."),
  addressLine2: z.string().trim().optional().default(""),
  state: z.string().trim().min(2, "State is required."),
  city: z.string().trim().min(2, "City is required."),
  pincode: z
    .string()
    .trim()
    .regex(/^[1-9][0-9]{5}$/, "Enter a valid 6-digit pincode."),
  landmark: z.string().trim().optional().default(""),
});

export const couponCodeSchema = z.object({
  code: z.string().trim().min(3).max(20),
});

export const createCheckoutOrderSchema = z.object({
  shippingAddress: shippingAddressSchema,
  items: z.array(checkoutLineItemSchema).min(1, "Your bag is empty."),
  couponCode: z.string().trim().optional(),
});

export const verifyPaymentSchema = z.object({
  orderId: z.uuid(),
  razorpayOrderId: z.string().trim().min(1),
  razorpayPaymentId: z.string().trim().min(1),
  razorpaySignature: z.string().trim().min(1),
});

export const reportPaymentFailureSchema = z.object({
  orderId: z.uuid(),
  reason: z.string().trim().optional(),
});

export const updateOrderStatusSchema = z.object({
  orderId: z.uuid(),
  orderStatus: z.enum(["pending", "confirmed", "shipped", "delivered", "cancelled"]),
});
