import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

const sendEmail = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method == "POST") {
    try {
      const sendtomail = await req.body?.mail;
      const message = await req.body?.message;

      const transporter = nodemailer.createTransport({
        host: process.env.HOST_MAIL,
        port: 587,
        secure: false,
        auth: {
          user: process.env.MAIL_ADMIN,
          pass: process.env.PW_ADMIN,
        },
        tls: {
          ciphers: "SSLv3",
          rejectUnauthorized: false,
        },
        debug: true,
        logger: true,
      });

      const mailOption = {
        form: process.env.MAIL_ADMIN,
        to: sendtomail,
        subject: "Send Mail",
        html: `${message}`,
      };

      await transporter.sendMail(mailOption);
      return res
        .status(200)
        .json({ message: "Send mail sucsscessfully" });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
};

export default sendEmail;
