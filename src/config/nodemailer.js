import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: "fahadbhati3600@gmail.com", // your gmail
    pass: process.env.EMAIL_PASS, // app password (NOT your real password)
  },
});

export const sendEmail = async (name, email, subject, message) => {
  try {
    // Email configuration
    const mailOptions = {
      from: `"${name}" <${email}>`, // sender
      to: "2024.mohd.bhati@ves.ac.in", // where YOU want to receive messages
      subject: subject || "New Contact Message",
      html: `
        <div style="font-family: Arial; padding: 10px;">
          <h2>New Contact Form Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong><br/>${message}</p>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Email Error:", error);
    return {
      success: false,
      message: "Failed to send email",
      error,
    };
  }
};
