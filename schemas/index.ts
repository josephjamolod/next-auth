import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, { message: "Password minimum 8 characters" }),
  twoFactorCode: z.optional(z.string()),
});

export const registerSchema = z.object({
  name: z
    .string({ message: "Please provide a name" })
    .min(1, { message: "Please provide atleast two character" }),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be atleast 8 character" }),
});

export const resetPasswordSchema = z.object({
  email: z.string().email(),
});

export const newPasswordSchema = z.object({
  password: z.string().min(8, { message: "Password minimum 8 characters" }),
});
