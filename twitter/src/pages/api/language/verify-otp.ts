import type { NextApiRequest, NextApiResponse } from "next"
import otpStore from "@/lib/otpStore"

export default function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const { otp, email, phone } = req.body

  const key = email || phone

  const stored = otpStore[key]

  if (!stored) {
    return res.status(400).json({ message: "OTP not found" })
  }

  if (stored.expires < Date.now()) {
    delete otpStore[key]
    return res.status(400).json({ message: "OTP expired" })
  }

  if (stored.otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP" })
  }

  delete otpStore[key]

  return res.status(200).json({
    message: "OTP verified",
    language: stored.language
  })
}