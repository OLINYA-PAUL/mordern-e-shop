import nodemailer, { Transporter } from "nodemailer";
import dotenv from "dotenv";
import ejs from "ejs";
import path from "path";

dotenv.config();

const transport: Transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) ?? 587,
  serice: process.env.SMTP_SERVICE,
  auth: {
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASS,
  },
});

//render ejs for mailing

export const sendEmailTemplate = (
  templateName: string,
  data: Record<string, any>
): Promise<string> => {
  //path for email

  const templatePath = path.join(
    process.cwd(),
    "auth-service",
    "src",
    "utils",
    "email-templates",
    `${templateName}.ejs`
  );

  return ejs.renderFile(templatePath, data);
};

export const sendEmail = async (
  to: string,
  subject: string,
  templateName: string,
  data: any
) => {
  try {
    const html = sendEmailTemplate(templateName, data);

    await transport.sendMail({
      from: `<${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.log(error as any);
  }
};
