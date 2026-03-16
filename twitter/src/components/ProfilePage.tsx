"use client";

import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Link as LinkIcon,
  MoreHorizontal,
  Camera,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import TweetCard from "./TweetCard";
import { Card, CardContent } from "./ui/card";
import EditProfile from "./EditProfile"; // ✅ fixed import
import axiosInstance from "@/lib/axios";

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState("posts");
  const [showEditModal, setShowEditModal] = useState(false);
  const [tweets, setTweets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingNotif, setUpdatingNotif] = useState(false);

  if (!user) return null;

  const fetchTweets = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/post");
      setTweets(res.data);
    } catch (err) {
      console.error("Error fetching tweets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  const userTweets = tweets.filter((tweet) => tweet.author._id === user._id);

  const toggleNotifications = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      alert("Notifications are not supported in this browser.");
      return;
    }

    try {
      setUpdatingNotif(true);

      if (!user.notificationsEnabled) {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          alert("Notification permission denied.");
          return;
        }
      }

      const updatedValue = !user.notificationsEnabled;
      const res = await axiosInstance.patch(`/userupdate/${user.email}`, {
        notificationsEnabled: updatedValue,
      });
      setUser(res.data);
    } catch (err) {
      console.error("Failed to update notification preference:", err);
    } finally {
      setUpdatingNotif(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-black/90 backdrop-blur-md border-b border-gray-800 z-10">
        <div className="flex items-center px-4 py-3 space-x-8">
          <Button variant="ghost" size="sm" className="p-2 rounded-full hover:bg-gray-900">
            <ArrowLeft className="h-5 w-5 text-white" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-white">{user.displayName}</h1>
            <p className="text-sm text-gray-400">{userTweets.length} posts</p>
          </div>
        </div>
      </div>

      {/* Cover & Profile */}
      <div className="relative">
        <div className="h-48 bg-gradient-to-r from-blue-600 to-purple-600 relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70"
          >
            <Camera className="h-5 w-5 text-white" />
          </Button>
        </div>

        <div className="absolute -bottom-16 left-4">
          <Avatar className="h-32 w-32 border-4 border-black">
            <AvatarImage src={user.avatar} alt={user.displayName} />
            <AvatarFallback>{user.displayName[0]}</AvatarFallback>
          </Avatar>
        </div>

        <div className="flex justify-end p-4">
          <Button
            variant="outline"
            className="border-gray-600 text-white rounded-full px-6"
            onClick={() => setShowEditModal(true)}
          >
            Edit profile
          </Button>
        </div>
      </div>

      {/* Info & Notification Toggle */}
      <div className="px-4 pb-4 mt-12">
        <div className="flex items-center justify-between bg-gray-900 rounded-xl p-4 mb-4">
          <div>
            <p className="text-white font-semibold">Keyword Notifications</p>
            <p className="text-sm text-gray-400">
              Get notified for tweets about cricket or science
            </p>
          </div>
          <Button
            onClick={toggleNotifications}
            disabled={updatingNotif}
            className={`rounded-full px-5 ${
              user.notificationsEnabled
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {user.notificationsEnabled ? "ON" : "OFF"}
          </Button>
        </div>

        <div className="flex items-start justify-between mb-3">
          <div>
            <h1 className="text-2xl font-bold text-white">{user.displayName}</h1>
            <p className="text-gray-400">@{user.username}</p>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-5 w-5 text-gray-400" />
          </Button>
        </div>

        {user.bio && <p className="text-white mb-3">{user.bio}</p>}

        <div className="flex items-center space-x-4 text-gray-400 text-sm">
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            <span>{user.location || "Earth"}</span>
          </div>
          <div className="flex items-center space-x-1">
            <LinkIcon className="h-4 w-4" />
            <span className="text-blue-400">{user.website || "example.com"}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>
              Joined{" "}
              {new Date(user.joinedDate).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 border-b border-gray-800">
          {["posts", "replies", "highlights", "articles", "media"].map((tab) => (
            <TabsTrigger key={tab} value={tab}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="posts">
          <div className="divide-y divide-gray-800">
            {loading ? (
              <Card className="bg-black border-none">
                <CardContent className="py-12 text-center text-gray-400">
                  Loading...
                </CardContent>
              </Card>
            ) : (
              userTweets.map((tweet) => <TweetCard key={tweet._id} tweet={tweet} />)
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* ✅ Edit Profile Modal */}
      <EditProfile
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
      />
    </div>
  );
}
