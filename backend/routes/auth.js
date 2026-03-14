// routes/auth.js
import express from "express";
import bcrypt from "bcrypt";
import User from "../modals/user.js";

const router = express.Router();

/* PASSWORD GENERATOR (letters only) */
function generatePassword(length = 10) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let password = "";

  for (let i = 0; i < length; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }

  return password;
}

/* FORGOT PASSWORD */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email, phone } = req.body;

    const user = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const now = new Date();

    if (
      user.lastPasswordResetRequest &&
      now - user.lastPasswordResetRequest < 86400000
    ) {
      return res.json({
        message: "You can use this option only one time per day.",
      });
    }

    const newPassword = generatePassword();

    user.password = await bcrypt.hash(newPassword, 10);
    user.lastPasswordResetRequest = now;

    await user.save();

    console.log("Generated password:", newPassword);

    res.json({
      message: "New password generated",
      password: newPassword, // for testing
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

export default router;