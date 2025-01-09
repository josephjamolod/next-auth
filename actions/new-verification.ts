"use server";

import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";
import { db } from "@/lib/db";

export const newVerification = async (token: string) => {
  try {
    if (!token) {
      return { error: "Missing token!" };
    }
    const existingToken = await getVerificationTokenByToken(token);
    console.log("red");

    console.log(existingToken?.email);

    if (!existingToken) {
      return { error: "Invalid token!" };
    }
    const hasExpired = new Date(existingToken?.expires) < new Date();
    if (hasExpired) {
      return { error: "token already expired" };
    }
    const existingUser = await getUserByEmail(existingToken.email);
    if (!existingUser) {
      return { error: "Email does not exist" };
    }

    await db.user.update({
      where: { id: existingUser.id },
      data: { emailVerified: new Date(), email: existingToken.email },
    });
    await db.verificationToken.delete({
      where: { token: existingToken.token },
    });
    return { success: "Email has been verified" };
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return { error: error.message };
    }
  }
};
