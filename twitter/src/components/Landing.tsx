"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import AuthModal from "./Authmodel";
import TwitterLogo from "./Twitterlogo";
import { useAuth } from "@/context/AuthContext";
import Feed from "./Feed";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("signup");
  const { user, googlesignin } = useAuth();
  const router = useRouter();

  const openAuthModal = (mode: "login" | "signup") => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  if (user) {
  return <Feed />;
}
  
  return (
    <div className="min-h-screen bg-black text-white flex">
      
      {/* Left side */}
      <div className="hidden lg:flex lg:flex-1 items-center justify-center">
        <TwitterLogo className="text-white h-80 w-80" />
      </div>

      {/* Right side */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 max-w-lg lg:max-w-2xl">

        <div className="lg:hidden mb-8 text-center">
          <TwitterLogo size="xl" className="text-white mx-auto" />
        </div>

        <div className="space-y-12">

          <div>
            <h1 className="text-5xl lg:text-6xl font-bold mb-8 leading-tight">
              Happening Now!
            </h1>
            <h2 className="text-2xl lg:text-3xl font-bold mb-8">
              Join today.
            </h2>
          </div>

          <div className="space-y-4 max-w-xs">
            <Button
              variant="outline"
              className="w-full py-3 rounded-full border-gray-600 bg-black text-white font-semibold text-base h-12"
              onClick={googlesignin}
            >
              Sign up with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-600" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black px-2 text-gray-400">or</span>
              </div>
            </div>

            <Button
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-full text-base h-12"
              onClick={() => openAuthModal("signup")}
            >
              Create account
            </Button>
          </div>

          <div className="space-y-5">
            <p className="text-lg font-bold">Already have an account?</p>

            <Button
              variant="outline"
              className="w-full max-w-xs py-3 rounded-full border-gray-600 hover:bg-gray-900 text-blue-400 font-semibold text-base h-12"
              onClick={() => openAuthModal("login")}
            >
              Log In
            </Button>

            <button
              onClick={() => router.push("/forgot-password")}
              className="flex items-center justify-center gap-2 text-blue-400 hover:text-blue-300 text-sm w-full max-w-xs"
            >
            
              Forgot Password?
            </button>
          </div>

        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />

    </div>
  );
}
