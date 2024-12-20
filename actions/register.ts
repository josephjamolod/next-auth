"use server";

import { registerSchema } from "@/schemas";
import * as z from "zod";

export const register = async (values: z.infer<typeof registerSchema>) => {
  const isValid = registerSchema.safeParse(values);
  if (!isValid.success) {
    return { error: "Invalid fields!" };
  }
  return { success: "Email sent!" };
};
