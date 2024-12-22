"use server";

import { signOut } from "@/auth";
import { authRoutes } from "@/routes";

export const logOut = async () => {
  await signOut({ redirectTo: authRoutes[0] });
};
