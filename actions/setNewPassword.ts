"use server";

import bcrypt, { genSalt } from "bcryptjs";
import { getResetPasswordTokenByToken } from "@/data/reset-password-token";
import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";
import { z } from "zod";
import { newPasswordSchema } from "@/schemas";

interface SetNewPasswordProp {
  token: string;
  password: z.infer<typeof newPasswordSchema>;
}

export const setNewPassword = async ({
  token,
  password,
}: SetNewPasswordProp) => {
  try {
    const isValidPassword = newPasswordSchema.safeParse(password);
    const { success, data } = isValidPassword;
    if (!success) {
      return { error: "Invalid Password" };
    }
    if (!token) {
      return { error: "Missing Token!" };
    }
    const hashPassword = await bcrypt.hash(data.password, await genSalt(10));
    const existingToken = await getResetPasswordTokenByToken(token);
    if (!existingToken) {
      return { error: "Invalid token!" };
    }
    const hasExpired = new Date(existingToken?.expires) < new Date();
    if (hasExpired) {
      return { error: "Token already expired" };
    }
    const existingUser = await getUserByEmail(existingToken.email);
    if (!existingUser) {
      return { error: "Email does not exist" };
    }
    await db.user.update({
      where: { id: existingUser.id },
      data: { password: hashPassword },
    });
    await db.resetPasswordToken.delete({
      where: { token: existingToken.token },
    });
    return { success: "Password Successfully Reset" };
  } catch {
    return null;
  }
};
