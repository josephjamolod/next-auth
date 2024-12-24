import { v4 as uuid } from "uuid";
import { db } from "./db";
import { getVerificationTokenByEmail } from "@/data/verification-token";

export const generateVerificationToken = async (email: string) => {
  try {
    const token = uuid();
    const expires = new Date(new Date().getTime() + 3600 * 1000);
    const existingToken = await getVerificationTokenByEmail(email);

    if (existingToken) {
      await db.verificationToken.delete({
        where: {
          token: existingToken.token,
        },
      });
    }
    const verificationToken = await db.verificationToken.create({
      data: { email, expires, token },
    });
    return verificationToken;
  } catch (error) {
    console.log(error);
  }
};
