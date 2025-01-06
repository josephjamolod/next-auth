import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";
import { db } from "./lib/db";
import { getUserById } from "./data/user";
import {
  deleteTwoFactorConfirmation,
  getTwoFactorConfirmationByUserId,
} from "./data/two-factor-confirmation";

export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      const existingUser = await getUserById(user.id!);
      //allow OAuth with email verification
      if (account?.provider !== "credentials") {
        return true;
      }
      //prevent sign in if email not verified
      if (!existingUser || !existingUser.emailVerified) {
        return false;
      }

      //if 2FA enable, dont let user log in without 2FConfirmation
      //delete the 2FConfirmation after
      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id
        );
        if (!twoFactorConfirmation) return false;
        await deleteTwoFactorConfirmation(twoFactorConfirmation.id);
      }

      return true;
    },
    async session({ token, session }) {
      console.log({ sessionToken: token });
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      if (session.user && token.role) {
        session.user.role = token.role;
      }
      if (session.user && token.isTwoFactorEnabled) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled;
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) {
        return token;
      }
      const existingUser = await getUserById(token.sub);
      if (!existingUser) {
        return token;
      }
      // console.log(existingUser);
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 },
  ...authConfig,
});
