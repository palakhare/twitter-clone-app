"use client";

import { useState } from "react";
import axios from "@/lib/axios";

export default function OTPModal({ email, onVerified }: any) {
  const [otp, setOtp] = useState("");

  const verifyOtp = async () => {
    const res = await axios.post("/otp/verify-otp", {
      email,
      otp,
    });

    if (res.data.otpVerified) {
      onVerified();
    }
  };

  return (
    <div className="p-4 border rounded">
      <p>OTP sent to {email}</p>

      <input
        className="border p-2 mt-2"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />

      <button onClick={verifyOtp} className="mt-2 bg-blue-500 text-white p-2">
        Verify OTP
      </button>
    </div>
  );
}
