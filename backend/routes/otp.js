import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();
const otpStore = new Map();

// 📩 Send OTP
router.post("/send", async (req, res) => {
  const { email } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore.set(email, otp);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    to: email,
    subject: "Your Audio Tweet OTP",
    text: `Your OTP is ${otp}. Valid for 5 minutes.`,
  });

  setTimeout(() => otpStore.delete(email), 5 * 60 * 1000);

  res.json({ message: "OTP sent" });
});



// ✅ Verify OTP
router.post("/verify", (req, res) => {
  const { email, otp } = req.body;

  if (otpStore.get(email) != otp) {
    return res.status(400).json({ verified: false });
  }

  otpStore.delete(email);
  res.json({ verified: true });
});

export default router;
