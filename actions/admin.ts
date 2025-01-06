"use server";

import { currentRole } from "@/lib/current-user";

export const adminAction = async () => {
  try {
    const role = await currentRole();
    if (role === "ADMIN") {
      return { success: "You are an admin" };
    }
    return { error: "Forbidden" };
  } catch {
    return { error: "Error fetching data" };
  }
};
