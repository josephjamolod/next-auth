import { transporter } from "@/lib/transporter";
import { TwoFactorToken, User } from "@prisma/client";

interface SendTwoFactorMailProp {
  user: User;
  token: TwoFactorToken;
}

export const sendTwoFactorMail = async ({
  user,
  token,
}: SendTwoFactorMailProp) => {
  const mailOptions = {
    from: `"Next-Auth" <${process.env.EMAIL}>`, // sender address
    to: user.email!, // list of receivers
    subject: "Two Factor Code", // Subject line
    html: `<p>Hello ${user.name}, here's your two factor code:</p>
    <p> ${token.token}</p>`, // html body
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Two Factor Email Sent");
    }
  });
};
