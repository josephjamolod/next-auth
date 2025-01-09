"use server";

import { signIn } from "@/auth";
import { sendVerificationMail } from "@/mail/sendVerificationMail";
import { getUserByEmail } from "@/data/user";
import {
  generateTwoFactorToken,
  generateVerificationToken,
} from "@/lib/tokens";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { loginSchema } from "@/schemas";

import { AuthError } from "next-auth";
import * as z from "zod";
import { sendTwoFactorMail } from "@/mail/sendTwoFactorMail";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { db } from "@/lib/db";
import {
  createTwoFactorConfirmation,
  deleteTwoFactorConfirmation,
  getTwoFactorConfirmationByUserId,
} from "@/data/two-factor-confirmation";

export const login = async (values: z.infer<typeof loginSchema>) => {
  const isValid = loginSchema.safeParse(values);
  if (!isValid.success) {
    return { error: "Invalid fields!" };
  }
  const { email, password, twoFactorCode } = isValid.data;
  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Invalid Credentials" };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );
    if (verificationToken)
      await sendVerificationMail({
        userEmail: existingUser.email,
        token: verificationToken,
      });
    return { success: "Confirmation Email Sent!" };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (twoFactorCode) {
      //verify the code
      const twoFactor = await getTwoFactorTokenByEmail(existingUser.email);
      const isTwoFactorMatch = twoFactor?.token === twoFactorCode;

      if (!twoFactor) {
        return { error: "Invalid code!" };
      }
      if (twoFactor?.expires) {
        const hasExpired = new Date(twoFactor?.expires) < new Date();
        if (hasExpired) return { error: "Two Factor Code already expired." };
      }
      if (!isTwoFactorMatch) return { error: "Invalid two factor code!" };

      await db.twoFactorToken.delete({ where: { token: twoFactor.token } });

      //get existing two factor confirmation doc
      const existingTwoFactorConfirmation =
        await getTwoFactorConfirmationByUserId(existingUser.id);
      //if exist, delete
      if (existingTwoFactorConfirmation) {
        await deleteTwoFactorConfirmation(existingTwoFactorConfirmation.id);
      }
      //create the two factor confirmation doc
      await createTwoFactorConfirmation(existingUser.id);
    } else {
      //generate two factor token
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      //send mail
      if (twoFactorToken) {
        await sendTwoFactorMail({ user: existingUser, token: twoFactorToken });
      }
      return { twoFactor: true };
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }
    throw error;
  }
};
