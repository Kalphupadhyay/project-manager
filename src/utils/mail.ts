import Mailgen from "mailgen";
import nodemailer from "nodemailer";

interface EmailOptions {
  email: string;
  subject: string;
  mailgenContent: Mailgen.Content;
}

export const sendEmail = async (options: EmailOptions) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Project Manager",
      link: "https://mailgen.js/",
    },
  });

  const emailText = mailGenerator.generatePlaintext(options.mailgenContent);

  const emailHtml = mailGenerator.generate(options.mailgenContent);

  const transport = nodemailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST,
    port: Number(process.env.MAILTRAP_SMTP_PORT),
    auth: {
      user: process.env.MAILTRAP_SMTP_USER,
      pass: process.env.MAILTRAP_SMTP_PASS,
    },
  });

  const mail = {
    from: "mail.taskmanager@example.com",
    to: options.email,
    subject: options.subject,
    text: emailText,
    html: emailHtml,
  };

  try {
    await transport.sendMail(mail);
  } catch (error) {
    console.log("Error sending email:", error);
  }
};

export const emailVerificationEmailGenContent = (
  username: string,
  verificationUrl: string,
): Mailgen.Content => {
  return {
    body: {
      name: username,
      intro: "Welcome to out App! We're very excited to have you on board.",
      action: {
        instructions: "To verify your email address, please click here:",
        button: {
          color: "#22BC66", // Optional action button color
          text: "verify your email",
          link: verificationUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

export const forgotPasswordTokenEmailGenContent = (
  username: string,
  resetUrl: string,
) => {
  return {
    body: {
      name: username,
      intro:
        "You have received this email because a password reset request for your account was received.",
      action: {
        instructions: "To reset your password, please click here:",
        button: {
          color: "#DC4D2F", // Optional action button color
          text: "reset your password",
          link: resetUrl,
        },
      },
      outro:
        "If you did not request a password reset, no further action is required on your part.",
    },
  };
};
