"use client";

import React, { useState } from "react";
import {
  Home,
  Search,
  Bell,
  Mail,
  Bookmark,
  User,
  MoreHorizontal,
  Settings,
  LogOut,
  Globe
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../ui/dropdown-menu";

import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import TwitterLogo from "../Twitterlogo";

import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";
import axios from "@/lib/axios";

interface SidebarProps {
  currentPage?: string;
  onNavigate?: (page: string) => void;
}

export default function Sidebar({ currentPage = "home", onNavigate }: SidebarProps) {
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  const userPhone = user?.phone ?? "8928446584";

  const [showOtp, setShowOtp] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [otp, setOtp] = useState("");

  /* LANGUAGE OTP FLOW */

  const changeLanguage = async (lang: string) => {
    try {
      await axios.post("/api/language/send-otp", {
        language: lang,
        email: user?.email,
        phone: userPhone
      });

      setSelectedLanguage(lang);
      setShowOtp(true);
    } catch (error) {
      console.error(error);
      alert("Failed to send OTP");
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await axios.post("/api/language/verify-otp", {
        otp,
        email: user?.email,
        phone: userPhone
      });

      if (res?.data?.message === "OTP verified") {
        i18n.changeLanguage(selectedLanguage);
        setShowOtp(false);
        setOtp("");
      }
    } catch (error) {
      alert("Invalid OTP");
    }
  };

  /* NAVIGATION */

  const navigation = [
    { name: t("home"), icon: Home, page: "home" },
    { name: t("explore"), icon: Search, page: "explore" },
    { name: t("notifications"), icon: Bell, page: "notifications", badge: true },
    { name: t("messages"), icon: Mail, page: "messages" },
    { name: t("bookmarks"), icon: Bookmark, page: "bookmarks" },
    { name: t("profile"), icon: User, page: "profile" }
  ];

  return (
    <div className="flex flex-col h-screen w-64 border-r border-gray-800 bg-black">

      {/* LOGO */}
      <div className="p-4">
        <TwitterLogo size="lg" className="text-white" />
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-2">

        <ul className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.page}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-xl py-6 px-4 rounded-full hover:bg-gray-900 ${
                    currentPage === item.page ? "font-bold" : "font-normal"
                  } text-white`}
                  onClick={() => onNavigate?.(item.page)}
                >
                  <Icon className="mr-4 h-7 w-7" />
                  {item.name}

                  {item.badge && (
                    <span className="ml-2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      3
                    </span>
                  )}
                </Button>
              </li>
            );
          })}
        </ul>

        {/* POST BUTTON */}
        <div className="mt-8 px-2">
          <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-full text-lg">
            {t("post")}
          </Button>
        </div>

        {/* LANGUAGE SWITCHER */}
        <div className="mt-6 px-4 text-gray-400 text-sm">

          <div className="flex items-center mb-2">
            <Globe className="mr-2 h-4 w-4" />
            Language
          </div>

          <div className="space-y-1">

            <div onClick={() => changeLanguage("en")} className="cursor-pointer hover:text-white">
              English
            </div>

            <div onClick={() => changeLanguage("fr")} className="cursor-pointer hover:text-white">
              Français
            </div>

            <div onClick={() => changeLanguage("hi")} className="cursor-pointer hover:text-white">
              हिंदी
            </div>

            <div onClick={() => changeLanguage("es")} className="cursor-pointer hover:text-white">
              Español
            </div>

            <div onClick={() => changeLanguage("pt")} className="cursor-pointer hover:text-white">
              Português
            </div>

            <div onClick={() => changeLanguage("zh")} className="cursor-pointer hover:text-white">
              中文
            </div>

          </div>
        </div>

      </nav>

      {/* USER MENU */}
      {user && (
        <div className="p-4 border-t border-gray-800">

          <DropdownMenu>

            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start p-3 rounded-full hover:bg-gray-900"
              >

                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={user?.avatar} alt={user?.displayName} />
                  <AvatarFallback>
                    {user?.displayName?.[0] ?? "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 text-left">
                  <div className="text-white font-semibold">
                    {user?.displayName}
                  </div>

                  <div className="text-gray-400 text-sm">
                    @{user?.username}
                  </div>
                </div>

                <MoreHorizontal className="h-5 w-5 text-gray-400" />

              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56 bg-black border-gray-800">

              <DropdownMenuItem className="text-white hover:bg-gray-900">
                <Settings className="mr-2 h-4 w-4" />
                {t("settings")}
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-gray-800" />

              <DropdownMenuItem
                className="text-white hover:bg-gray-900"
                onClick={logout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                {t("logout")} @{user?.username}
              </DropdownMenuItem>

            </DropdownMenuContent>

          </DropdownMenu>

        </div>
      )}

      {/* OTP MODAL */}
      {showOtp && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70">

          <div className="bg-gray-900 p-6 rounded-lg w-80">

            <h2 className="text-white mb-3 text-lg">
              Enter OTP
            </h2>

            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-2 bg-black border border-gray-700 text-white mb-3"
              placeholder="OTP"
            />

            <Button
              className="w-full bg-blue-500"
              onClick={verifyOtp}
            >
              Verify
            </Button>

          </div>

        </div>
      )}

    </div>
  );
}