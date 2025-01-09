"use server";

import { getUserByEmail, getUserById } from "@/data/user";
import bcrypt, { genSalt } from "bcryptjs";
import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { settingsSchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationMail } from "@/mail/sendVerificationMail";

export const updateSettings = async (
  values: z.infer<typeof settingsSchema>
) => {
  try {
    const user = await currentUser();
    if (!user) {
      return { error: "Unauthorize user detected!" };
    }

    const existingUser = await getUserById(user.id!);
    if (!existingUser) {
      return { error: "Unauthorize user detected!" };
    }

    //dont allow to update some field if oaut provider
    if (user.isOauth) {
      values.email = undefined;
      values.password = undefined;
      values.newPassword = undefined;
      values.isTwoFactorEnabled = undefined;
    }

    //send verification mail if user update the email
    //this is not working properly because there's no way you can verify the new email
    //i suggest to not " return { success: "Verification Email Sent" };'" instead make the email updated and make the isVerified to false
    //or You can create a new verifier function for new accounts and for accounts that just want to update their email
    if (values.email && values.email !== user.email) {
      const userExist = await getUserByEmail(values.email);

      if (userExist && userExist.id !== user.id) {
        return { error: "Email already in use!" };
      }
      const verificationToken = await generateVerificationToken(values.email);
      await sendVerificationMail({
        userEmail: verificationToken?.email as string,
        token: verificationToken!,
      });
      return { success: "Verification Email Sent" };
    }

    //check the old password is correct before they can update the password
    if (values.password && values.newPassword && existingUser.password) {
      const isCorrectPassword = await bcrypt.compare(
        values.password,
        existingUser.password
      );
      if (!isCorrectPassword) return { error: "Incorrect Password" };
      const hashedPassword = await bcrypt.hash(
        values.password,
        await genSalt(10)
      );
      values.password = hashedPassword;
      values.newPassword = undefined;
    }

    await db.user.update({
      where: { id: existingUser?.id },
      data: { ...values },
    });

    revalidatePath("/settings");
    return { success: "Settings successfully updated" };
  } catch (error) {
    console.log(error);
  }
};
