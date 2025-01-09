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
    subject: "2FA Code", // Subject line
    html: `<p>Hello ${user.name}, here's your 2FA code:</p>
    <p> ${token.token}</p>`, // html body
  };

  await new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        console.log("Two Factor Email Sent!");
        resolve(info);
      }
    });
  });
};
