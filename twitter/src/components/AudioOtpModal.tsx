"use client";
import { useState } from "react";
import axios from "@/lib/axios";

export default function AudioOtpModal({ email, onVerified }: any) {
  const [otp, setOtp] = useState("");

  const verifyOtp = async () => {
    const res = await axios.post("/otp/verify", { email, otp });
    if (res.data.verified) onVerified();
  };

  return (
    <div className="p-4 bg-black text-white">
      <input
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="border p-2"
      />
      <button onClick={verifyOtp}>Verify</button>
    </div>
  );
}
