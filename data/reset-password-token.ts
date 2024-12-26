import { db } from "@/lib/db";

export const getResetPasswordTokenByToken = async (token: string) => {
  try {
    const existingToken = await db.resetPasswordToken.findUnique({
      where: { token },
    });
    return existingToken;
  } catch {
    return null;
  }
};

export const getResetPasswordTokenByEmail = async (email: string) => {
  try {
    const existingToken = await db.resetPasswordToken.findFirst({
      where: { email },
    });
    return existingToken;
  } catch {
    return null;
  }
};
