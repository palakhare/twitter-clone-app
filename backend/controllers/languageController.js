let languageOtp = null;

export const sendLanguageOtp = async (req, res) => {
  try {
    const { email, language } = req.body;

    languageOtp = Math.floor(100000 + Math.random() * 900000);

    console.log("OTP:", languageOtp);

    res.json({
      message: "OTP sent",
      otp: languageOtp
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const verifyLanguageOtp = (req, res) => {

  const { otp } = req.body;

  if (Number(otp) === languageOtp) {
    return res.json({ message: "OTP verified" });
  }

  res.status(400).json({ message: "Invalid OTP" });
};