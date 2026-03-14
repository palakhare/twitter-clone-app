import Otp from "../modals/Otp.js";
import nodemailer from "nodemailer";

export const sendOtp = async (req, res) => {
  const { userId, email } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await Otp.deleteMany({ userId });

  await Otp.create({
    userId,
    otp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 mins
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  await transporter.sendMail({
    to: email,
    subject: "Your Audio Tweet OTP",
    text: `Your OTP is ${otp}. Valid for 5 minutes.`,
  });

  res.json({ message: "OTP sent" });
};

export const verifyOtp = async (req, res) => {
  const { userId, otp } = req.body;

  const record = await Otp.findOne({ userId, otp });

  if (!record || record.expiresAt < new Date()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  await Otp.deleteMany({ userId });

  res.json({ verified: true });
};
