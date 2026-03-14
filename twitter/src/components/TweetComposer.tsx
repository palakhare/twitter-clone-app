"use client";
import React, { useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";

import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

import {
  Image as ImageIcon,
  Smile,
  Calendar,
  MapPin,
  BarChart3,
  X,
} from "lucide-react";

import axios from "@/lib/axios";

interface TweetComposerProps {
  onTweetPosted: (tweet: any) => void;
}

const TweetComposer: React.FC<TweetComposerProps> = ({ onTweetPosted }) => {
  const { user } = useAuth();
  if (!user) return null;

  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioDuration, setAudioDuration] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpSending, setOtpSending] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const audioInputRef = useRef<HTMLInputElement | null>(null);

  const maxLength = 200;
  const isOverLimit = content.length > maxLength;

  /* ---------------- OTP ---------------- */

  const sendOtp = async () => {
    if (otpSending) return;
    try {
      setOtpSending(true);
      await axios.post("/otp/send", {
        userId: user._id,
        email: user.email,
      });
      setOtpSent(true);
    } catch {
      alert("Failed to send OTP");
    } finally {
      setOtpSending(false);
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await axios.post("/otp/verify", {
        userId: user._id,
        otp: otp.trim(),
      });

      if (res.data?.verified) {
        setOtpVerified(true);
      } else {
        alert("Invalid OTP");
      }
    } catch {
      alert("Invalid OTP");
    }
  };

  /* ---------------- AUDIO TIME WINDOW ---------------- */

  const isWithinAudioTimeWindow = () => {
    const ist = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );
    const hour = ist.getHours();
    return hour >= 14 && hour < 19;
  };

  /* ---------------- AUDIO UPLOAD ---------------- */

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isWithinAudioTimeWindow()) {
      alert("Audio tweets allowed only between 2–7 PM IST");
      e.target.value = "";
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      alert("Audio must be under 100MB");
      e.target.value = "";
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const audio = new Audio(objectUrl);

    audio.onloadedmetadata = () => {
      if (audio.duration > 300) {
        alert("Audio must be under 5 minutes");
        URL.revokeObjectURL(objectUrl);
        e.target.value = "";
        return;
      }

      setAudioFile(file);
      setAudioDuration(audio.duration);
      setOtp("");
      setOtpSent(false);
      setOtpVerified(false);
      URL.revokeObjectURL(objectUrl);
    };
  };

  /* ---------------- IMAGE UPLOAD ---------------- */

  const handlePhotoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setIsLoading(true);

      const res = await fetch(
        "https://api.imgbb.com/1/upload?key=97f3fb960c3520d6a88d7e29679cf96f",
        { method: "POST", body: formData }
      );

      const data = await res.json();

      if (!data?.data?.display_url) {
        throw new Error("Image upload failed");
      }

      setImageUrl(data.data.display_url);
    } catch {
      alert("Image upload failed");
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- POST ---------------- */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoading) return;

    const trimmedContent = content.trim();
    if (!trimmedContent || isOverLimit) return;
    if (audioFile && !otpVerified) return;

    try {
      setIsLoading(true);

      let audioUrl: string | null = null;

      if (audioFile) {
        const formData = new FormData();
        formData.append("audio", audioFile);

        const uploadRes = await axios.post("/upload/audio", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        audioUrl = uploadRes.data?.url || null;
      }

      const payload = {
        author: user._id,
        content: trimmedContent,
        image: imageUrl,
        audio: audioUrl,
        audioDuration,
        isAudioTweet: Boolean(audioFile),
      };

      const res = await axios.post("/post", payload);

      if (!res.data) throw new Error();

      onTweetPosted(res.data);

      // reset
      setContent("");
      setImageUrl(null);
      setAudioFile(null);
      setAudioDuration(null);
      setOtp("");
      setOtpSent(false);
      setOtpVerified(false);

      if (fileInputRef.current) fileInputRef.current.value = "";
      if (audioInputRef.current) audioInputRef.current.value = "";
    } catch {
      alert("Failed to post tweet");
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <Card className="bg-black border-gray-800 border-x-0 border-t-0 rounded-none">
      <CardContent className="p-4">
        <div className="flex space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.displayName?.[0]}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <form onSubmit={handleSubmit}>
              <Textarea
                placeholder="What's happening?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="bg-transparent border-none text-xl text-white resize-none min-h-[120px]"
              />

              {imageUrl && (
                <div className="relative mt-3 rounded-xl overflow-hidden">
                  <img
                    src={imageUrl}
                    alt="preview"
                    className="w-full max-h-80 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setImageUrl(null)}
                    className="absolute top-2 right-2 bg-black/70 p-1 rounded-full"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                </div>
              )}

              {audioFile && (
                <div className="mt-3 text-sm text-gray-300">
                  🎧 {audioFile.name}
                  <button
                    type="button"
                    className="ml-3 text-red-400"
                    onClick={() => {
                      setAudioFile(null);
                      setOtp("");
                      setOtpSent(false);
                      setOtpVerified(false);
                    }}
                  >
                    Remove
                  </button>
                </div>
              )}

              {audioFile && !otpVerified && (
                <div className="mt-3">
                  {!otpSent ? (
                    <Button type="button" onClick={sendOtp} disabled={otpSending}>
                      {otpSending ? "Sending..." : "Send OTP"}
                    </Button>
                  ) : (
                    <div className="flex gap-2 mt-2">
                      <input
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter OTP"
                        className="bg-black border px-3 py-2 text-white"
                      />
                      <Button type="button" onClick={verifyOtp}>
                        Verify
                      </Button>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between mt-4">
                <div className="flex space-x-4 text-blue-400">
                  <label className="cursor-pointer">
                    <ImageIcon className="h-5 w-5" />
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />
                  </label>

                  <label className="cursor-pointer">
                    🎤
                    <input
                      ref={audioInputRef}
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      onChange={handleAudioUpload}
                    />
                  </label>

                  <Smile className="h-5 w-5" />
                  <Calendar className="h-5 w-5" />
                  <MapPin className="h-5 w-5" />
                  <BarChart3 className="h-5 w-5" />
                </div>

                <Button
                  type="submit"
                  disabled={
                    isLoading ||
                    !content.trim() ||
                    isOverLimit ||
                    (audioFile && !otpVerified)
                  }
                  className="bg-blue-500 rounded-full px-6"
                >
                  {isLoading ? "Posting..." : "Post"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TweetComposer;