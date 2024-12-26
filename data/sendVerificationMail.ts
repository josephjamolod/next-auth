import { transporter } from "@/lib/transporter";
import { User, VerificationToken } from "@prisma/client";

interface SendVerificationMailProp {
  user: User;
  token: VerificationToken;
}

export const sendVerificationMail = async ({
  user,
  token,
}: SendVerificationMailProp) => {
  const mailOptions = {
    from: `"Next-Auth" <${process.env.EMAIL}>`, // sender address
    to: user.email!, // list of receivers
    subject: "Verify your Email", // Subject line
    html: `<p>Hello ${user.name}, verify your email by clicking this link:</p>
    <a href="${process.env.CLIENT_URL}/auth/verifyEmail/?token=${token.token}">Verify Your Email</a>`, // html body
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Verification Email Sent");
    }
  });
};
