// controllers/authController.js
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import User from "../modals/user.js";

// 🔐 random password generator (only letters)
const generatePassword = (length = 10) => {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }
  return password;
};

// ================= FORGOT PASSWORD =================
export const forgotPassword = async (req, res) => {
  try {
    const { email, phone } = req.body;

    if (!email && !phone) {
      return res.status(400).json({
        message: "Email or phone is required",
      });
    }

    const user = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // ⛔ Allow only once per day
    if (user.lastPasswordResetRequest) {
      const last = new Date(user.lastPasswordResetRequest);
      const now = new Date();

      const sameDay =
        last.getDate() === now.getDate() &&
        last.getMonth() === now.getMonth() &&
        last.getFullYear() === now.getFullYear();

      if (sameDay) {
        return res.status(429).json({
          message: "You can use this option only one time per day",
        });
      }
    }

    // 🔑 Generate & hash new password
    const newPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.lastPasswordResetRequest = new Date();
    await user.save();

    // 📧 Send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Gmail App Password
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Your new password",
      text: `Your new password is: ${newPassword}`,
    });

    return res.json({
      message: "New password sent to your registered email",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

// ================= LOGIN (placeholder) =================
export const login = async (req, res) => {
  return res.json({ message: "login ok" });
};

// ================= SIGNUP (placeholder) =================
export const signup = async (req, res) => {
  return res.json({ message: "signup ok" });
};
