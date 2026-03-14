"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import TwitterLogo from "@/components/Twitterlogo";
import { KeyRound } from "lucide-react";

export default function ForgotPasswordPage() {

  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {

    const res = await fetch("http://localhost:5001/api/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: input.includes("@") ? input : undefined,
        phone: !input.includes("@") ? input : undefined
      })
    });

    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">

      <div className="w-full max-w-md space-y-8">

        <TwitterLogo size="xl" className="mx-auto" />

        <h1 className="text-3xl font-bold text-center">
          Reset your password
        </h1>

        <input
          type="text"
          placeholder="Email or phone"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-3 rounded-lg bg-black border border-gray-600"
        />

        <Button
          onClick={handleSubmit}
          className="w-full bg-blue-500 hover:bg-blue-600 rounded-full h-12"
        >
          <KeyRound size={16} className="mr-2" />
          Generate Password
        </Button>

        {message && (
          <p className="text-center text-gray-400 text-sm">
            {message}
          </p>
        )}

      </div>
    </div>
  );
}
