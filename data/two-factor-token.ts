import { db } from "@/lib/db";

export const getTwoFactorTokenByEmail = async (email: string) => {
  try {
    const existingToken = await db.twoFactorToken.findFirst({
      where: { email },
    });
    return existingToken;
  } catch (error) {
    console.log(error);
    return null;
  }
};
