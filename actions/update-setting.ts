"use server";

import { getUserById } from "@/data/user";
import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { settingsSchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import { z } from "zod";

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

    await db.user.update({
      where: { id: existingUser?.id },
      data: { ...values },
    });
    revalidatePath("/settings");
    return { success: "Name successfully updated" };
  } catch (error) {
    console.log(error);
  }
};
