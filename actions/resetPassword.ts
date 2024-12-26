"use server";

import { sendResetPasswordMail } from "@/data/sendResetPasswordMail";
import { getUserByEmail } from "@/data/user";
import { generateResetPasswordToken } from "@/lib/tokens";
import { resetPasswordSchema } from "@/schemas";
import { z } from "zod";

export const resetPassword = async (
  value: z.infer<typeof resetPasswordSchema>
) => {
  const isValid = resetPasswordSchema.safeParse(value);
  const { data, success } = isValid;
  if (!success) {
    return { error: "Invalid Credentials" };
  }
  try {
    const existingUser = await getUserByEmail(data.email);
    if (!existingUser) {
      return { error: "Invalid Email !" };
    }
    if (existingUser.email) {
      const resetPasswordToken = await generateResetPasswordToken(
        existingUser.email!
      );
      if (resetPasswordToken) {
        await sendResetPasswordMail({
          user: existingUser,
          token: resetPasswordToken,
        });
      }
    }

    //generate password token then send token
    return { success: "Mail for resetting you password has been sent!" };
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return { error: error.message };
    }
  }
};
