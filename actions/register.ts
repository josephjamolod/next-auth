"use server";
import bcrypt, { genSalt } from "bcryptjs";

import { registerSchema } from "@/schemas";
import * as z from "zod";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationMail } from "@/mail/sendVerificationMail";

export const register = async (values: z.infer<typeof registerSchema>) => {
  const isValid = registerSchema.safeParse(values);
  const { data: userData, success } = isValid;
  if (!success) {
    return { error: "Invalid fields!" };
  }
  const hashPassword = await bcrypt.hash(userData.password, await genSalt(10));
  const isUserExist = await getUserByEmail(userData.email);
  if (isUserExist) {
    return { error: "Email already exist, try signing in." };
  }
  const user = await db.user.create({
    data: {
      name: userData.name,
      email: userData.email,
      password: hashPassword,
    },
  });

  if (user.email) {
    const verificationToken = await generateVerificationToken(user.email);
    if (verificationToken)
      await sendVerificationMail({
        userEmail: user.email,
        token: verificationToken,
      });
  }

  return { success: "Confimation Email sent!" };
};
