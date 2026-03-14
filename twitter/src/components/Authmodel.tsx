"use client";

import React, { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import axios from "@/lib/axios";

import LoadingSpinner from "./loading-spinner";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import TwitterLogo from "./Twitterlogo";

type AuthMode = "login" | "signup" | "forgot";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
}

export default function AuthModal({
  isOpen,
  onClose,
  initialMode = "login",
}: AuthModalProps) {
  const { login, signup, isLoading } = useAuth();

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    displayName: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  // ---------- VALIDATION ----------
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }

    if (mode !== "forgot" && !formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    if (mode === "signup") {
      if (!formData.username.trim()) {
        newErrors.username = "Username is required";
      }
      if (!formData.displayName.trim()) {
        newErrors.displayName = "Display name is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------- SUBMIT ----------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || isLoading) return;

    try {
      if (mode === "login") {
        await login(formData.email, formData.password);
        onClose();
      }

      if (mode === "signup") {
        await signup(
          formData.email,
          formData.password,
          formData.username,
          formData.displayName
        );
        onClose();
      }

      if (mode === "forgot") {
        await axios.post("/auth/forgot-password", {
          email: formData.email,
        });

        alert("New password sent to your email");
        setMode("login");
      }

      setFormData({
        email: "",
        password: "",
        username: "",
        displayName: "",
      });
      setErrors({});
    } catch (err: any) {
      setErrors({
        general: err?.response?.data?.message || "Something went wrong",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // ---------- UI ----------
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-black border-gray-800 text-white">
        <CardHeader className="relative pb-6">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X />
          </Button>

          <div className="text-center">
            <TwitterLogo size="xl" className="mx-auto mb-6" />
            <CardTitle className="text-2xl font-bold">
              {mode === "login" && "Sign in to X"}
              {mode === "signup" && "Create your account"}
              {mode === "forgot" && "Reset your password"}
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {errors.general && (
            <div className="text-red-400 text-sm">{errors.general}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <>
                <Input
                  placeholder="Display name"
                  value={formData.displayName}
                  onChange={(e) =>
                    handleInputChange("displayName", e.target.value)
                  }
                />
                <Input
                  placeholder="Username"
                  value={formData.username}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                />
              </>
            )}

            <Input
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                handleInputChange("email", e.target.value)
              }
            />

            {mode !== "forgot" && (
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </Button>
              </div>
            )}

            {mode === "login" && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setMode("forgot")}
                  className="text-sm text-blue-400 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <Button type="submit" className="w-full bg-blue-500 rounded-full">
              {isLoading ? <LoadingSpinner size="sm" /> : "Continue"}
            </Button>
          </form>

          <Separator />

          {mode !== "forgot" && (
            <div className="text-center text-gray-400">
              {mode === "login" ? "No account?" : "Already have an account?"}
              <Button
                variant="link"
                onClick={() =>
                  setMode(mode === "login" ? "signup" : "login")
                }
              >
                {mode === "login" ? "Sign up" : "Sign in"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
