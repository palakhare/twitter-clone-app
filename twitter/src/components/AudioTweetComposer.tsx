"use client";

import React, { useState, useRef } from "react";
import { Mic, Square, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import axios from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";

export default function AudioTweetComposer() {
  const { user } = useAuth();

  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpInput, setOtpInput] = useState("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // ======================
  // 🎙 START RECORDING
  // ======================
  const startRecording = async () => {
    if (!navigator.mediaDevices) {
      alert("Recording not supported in this browser");
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorderRef.current = mediaRecorder;
    chunksRef.current = [];
    setDuration(0);

    mediaRecorder.ondataavailable = (event) => {
      chunksRef.current.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      setAudioBlob(blob);
      setAudioURL(URL.createObjectURL(blob));
    };

    mediaRecorder.start();
    setRecording(true);

    // duration counter (max 300 sec)
    timerRef.current = setInterval(() => {
      setDuration((prev) => {
        if (prev >= 300) {
          stopRecording();
          alert("Maximum 5 minutes reached");
          return 300;
        }
        return prev + 1;
      });
    }, 1000);
  };

  // ======================
  // ⏹ STOP RECORDING
  // ======================
  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // ======================
  // 📧 SEND OTP
  // ======================
  const sendOTP = async () => {
    try {
      await axios.post("http://localhost:5001/api/otp/send", {
  userId: user._id,
  email: user.email,
});
      setOtpSent(true);
      alert("OTP sent to your email");
    } catch (err) {
      alert("Failed to send OTP");
    }
  };

  // ======================
  // 🔐 VERIFY OTP
  // ======================
  const verifyOTP = async () => {
    try {
      await axios.post("/audio/verify-audio-otp", {
        email: user?.email,
        otp: otpInput,
      });
      setOtpVerified(true);
      alert("OTP Verified");
    } catch {
      alert("Invalid OTP");
    }
  };

  // ======================
  // ⬆ UPLOAD AUDIO
  // ======================
  const uploadAudio = async () => {
    if (!audioBlob || !otpVerified) {
      alert("Complete OTP verification first");
      return;
    }

    if (duration > 300) {
      alert("Audio exceeds 5 minutes");
      return;
    }

    const formData = new FormData();
    formData.append("audio", audioBlob);
    formData.append("email", user?.email || "");
    formData.append("duration", duration.toString());

    try {
      await axios.post("/audio/upload-audio", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Audio Tweet Posted");

      // reset state
      setAudioBlob(null);
      setAudioURL(null);
      setDuration(0);
      setOtpSent(false);
      setOtpVerified(false);
      setOtpInput("");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Upload failed");
    }
  };

  // ======================
  // UI
  // ======================
  return (
    <div className="bg-black p-4 border border-gray-800 rounded-xl text-white space-y-4">

      <h2 className="text-lg font-bold">Audio Tweet</h2>

      {/* Recording Controls */}
      <div className="flex gap-3 items-center">
        {!recording ? (
          <Button onClick={startRecording} className="bg-blue-500">
            <Mic className="mr-2" /> Record
          </Button>
        ) : (
          <Button onClick={stopRecording} className="bg-red-500">
            <Square className="mr-2" /> Stop
          </Button>
        )}

        <span>{duration}s / 300s</span>
      </div>

      {/* Preview */}
      {audioURL && (
        <audio controls src={audioURL} className="w-full" />
      )}

      {/* OTP Section */}
      {audioBlob && !otpVerified && (
        <div className="space-y-2">
          {!otpSent ? (
            <Button onClick={sendOTP} className="bg-yellow-500">
              Send OTP
            </Button>
          ) : (
            <>
              <Input
                placeholder="Enter OTP"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
              />
              <Button onClick={verifyOTP} className="bg-green-600">
                Verify OTP
              </Button>
            </>
          )}
        </div>
      )}

      {/* Upload Button */}
      {otpVerified && (
        <Button
          onClick={uploadAudio}
          className="w-full bg-blue-600"
        >
          <Upload className="mr-2" />
          Post Audio Tweet
        </Button>
      )}
    </div>
  );
}
