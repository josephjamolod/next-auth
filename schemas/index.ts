import { UserRole } from "@prisma/client";
import * as z from "zod";

export const settingsSchema = z
  .object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(8)),
    newPassword: z.optional(z.string().min(8)),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }
      return true;
    },
    { message: "New Password is required!", path: ["newPassword"] }
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }
      return true;
    },
    { message: "Password is required!", path: ["newPassword"] }
  );

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
