import { transporter } from "@/lib/transporter";
import { User, VerificationToken } from "@prisma/client";
import { resolve } from "path";

interface SendResetPasswordMailProp {
  user: User;
  token: VerificationToken;
}

export const sendResetPasswordMail = async ({
  user,
  token,
}: SendResetPasswordMailProp) => {
  const mailOptions = {
    from: `"Next-Auth" <${process.env.EMAIL}>`, // sender address
    to: user.email!, // list of receivers
    subject: "Reset your password", // Subject line
    html: `<p>Hello ${user.name}, reset your password by clicking this link:</p>
    <a href="${process.env.CLIENT_URL}/auth/newPassword/?token=${token.token}">Reset Your Password</a>`, // html body
  };

  await new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        console.log("Email for reset password sent!");
        resolve(info);
      }
    });
  });
  // await new Promise((resolve, reject) => {
  //   // send mail
  //   transporter.sendMail(mailData, (err, info) => {
  //       if (err) {
  //           console.error(err);
  //           reject(err);
  //       } else {
  //           console.log(info);
  //           resolve(info);
  //       }
  //   }
  // transporter.sendMail(mailOptions, (error) => {
  //   if (error) {
  //     console.log(error);
  //   } else {
  //     console.log("Email for reset password sent!");
  //   }
  // });
};
