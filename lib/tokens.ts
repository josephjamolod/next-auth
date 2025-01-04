import { v4 as uuid } from "uuid";
import crypto from "crypto";
import { db } from "./db";
import { getVerificationTokenByEmail } from "@/data/verification-token";
import { getResetPasswordTokenByEmail } from "@/data/reset-password-token";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";

export const generateVerificationToken = async (email: string) => {
  try {
    const token = uuid();
    const expires = new Date(new Date().getTime() + 3600 * 1000);
    const existingToken = await getVerificationTokenByEmail(email);

    if (existingToken) {
      await db.verificationToken.delete({
        where: {
          token: existingToken.token,
        },
      });
    }
    const verificationToken = await db.verificationToken.create({
      data: { email, expires, token },
    });
    return verificationToken;
  } catch {
    return null;
  }
};

export const generateResetPasswordToken = async (email: string) => {
  try {
    const token = uuid();
    const expires = new Date(new Date().getTime() + 3600 * 1000);
    const existingToken = await getResetPasswordTokenByEmail(email);

    if (existingToken) {
      await db.resetPasswordToken.delete({
        where: { token: existingToken.token },
      });
    }
    const resetPasswordToken = await db.resetPasswordToken.create({
      data: { email, expires, token },
    });
    return resetPasswordToken;
  } catch {
    return null;
  }
};

export const generateTwoFactorToken = async (email: string) => {
  try {
    const token = crypto.randomInt(100_000).toString();
    const expires = new Date(new Date().getTime() + 3600 * 1000);
    const existingToken = await getTwoFactorTokenByEmail(email);

    if (existingToken) {
      await db.twoFactorToken.delete({ where: { token: existingToken.token } });
    }

    const twoFactorToken = await db.twoFactorToken.create({
      data: { email, expires, token },
    });
    return twoFactorToken;
  } catch {
    return null;
  }
};
