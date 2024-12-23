import { UserRole } from "@prisma/client";
import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
// import { AdapterUser } from "next-auth/adapters";

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole;
  }
}
