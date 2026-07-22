import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
// import { create as createPdf } from "html2pdf.js";

const sendEmail = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method === "POST") {
    try {
      const sendtomail = req.body?.mail;
      const message = req.body?.message;

      // Tạo transporter để gửi email
      const transporter = nodemailer.createTransport({
        host: process.env.HOST_MAIL || "",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
          user: process.env.MAIL_ADMIN || "",
          pass: process.env.PW_ADMIN || "",
        },
        tls: {
          ciphers: "SSLv3",
          rejectUnauthorized: false,
        },
        debug: true,
        logger: true,
      });

      // Tạo PDF từ HTML
      // const pdfAttachment = await new Promise((resolve, reject) => {
      //   createPdf(message).toPdf((pdf: any) => {
      //     resolve({
      //       filename: "attachment.pdf",
      //       content: pdf.output("blob"),
      //     });
      //   });
      // });
      // Cấu hình các tùy chọn cho email
      const mailOption: any = {
        from: process.env.MAIL_ADMIN || "",
        to: sendtomail,
        subject: "Send Mail",
        html: message,
        // attachments: [pdfAttachment],
      };

      // Gửi email
      await transporter.sendMail(mailOption);

      return res
        .status(200)
        .json({ message: "Send mail successfully" });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
};

export default sendEmail;
