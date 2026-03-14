type OtpData = {
  otp: string
  language: string
  expires: number
}

const otpStore: Record<string, OtpData> = {}

export default otpStore