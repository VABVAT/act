import { z } from "zod";

export const loginSchema = z.object({
  email: z.email().trim(),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const signupSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name."),
  email: z.email().trim(),
  phone: z
    .string()
    .trim()
    .min(10, "Please enter a valid phone number.")
    .max(15, "Please enter a valid phone number."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[a-zA-Z]/, "Password must contain at least one letter.")
    .regex(/[0-9]/, "Password must contain at least one number."),
});

export const forgotPasswordSchema = z.object({
  email: z.email().trim(),
});

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[a-zA-Z]/, "Password must contain at least one letter.")
    .regex(/[0-9]/, "Password must contain at least one number."),
  confirmPassword: z.string(),
}).refine((values) => values.password === values.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});
