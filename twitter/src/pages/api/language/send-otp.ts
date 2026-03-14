import type { NextApiRequest, NextApiResponse } from "next"
import otpStore from "@/lib/otpStore"

export default function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const { language, email, phone } = req.body

  if (!language) {
    return res.status(400).json({ message: "Language required" })
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString()

  const key = language === "fr" ? email : phone

  if (!key) {
    return res.status(400).json({ message: "User identifier missing" })
  }

  otpStore[key] = {
    otp,
    language,
    expires: Date.now() + 5 * 60 * 1000
  }

  if (language === "fr") {
    console.log(`EMAIL OTP to ${email}: ${otp}`)
  } else {
    console.log(`SMS OTP to ${phone}: ${otp}`)
  }

  return res.status(200).json({
    message: "OTP sent"
  })
}