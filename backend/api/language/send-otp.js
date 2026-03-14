import express from "express";
const router = express.Router();

router.post("/send-otp", async (req, res) => {

  const { language, email, phone } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000);

  console.log("OTP:", otp);

  // store temporarily
  global.languageOtp = otp;

  res.json({
    message: "OTP sent",
    otp // remove in production
  });

});

router.post("/verify-otp", (req, res) => {

  const { otp } = req.body;

  if (Number(otp) === global.languageOtp) {
    return res.json({ message: "OTP verified" });
  }

  res.status(400).json({ message: "Invalid OTP" });

});

export default router;