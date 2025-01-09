import { transporter } from "@/lib/transporter";
import { VerificationToken } from "@prisma/client";

interface SendVerificationMailProp {
  userEmail: string;
  token: VerificationToken;
}

export const sendVerificationMail = async ({
  userEmail,
  token,
}: SendVerificationMailProp) => {
  const mailOptions = {
    from: `"Next-Auth" <${process.env.EMAIL}>`, // sender address
    to: userEmail, // list of receivers
    subject: "Verify your Email", // Subject line
    html: `<p>Hello ${userEmail}, verify your email by clicking this link:</p>
    <a href="${process.env.CLIENT_URL}/auth/verifyEmail/?token=${token.token}">Verify Your Email</a>`, // html body
  };

  await new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        console.log("Verification Email Sent");
        resolve(info);
      }
    });
  });
};
