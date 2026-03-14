"use client";

import React, { useEffect, useState, useRef } from "react";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent } from "./ui/card";
import LoadingSpinner from "./loading-spinner";
import TweetCard from "./TweetCard";
import TweetComposer from "./TweetComposer";
import axiosInstance from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";

const Feed = () => {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const notifiedTweetIds = useRef<Set<string>>(new Set());

  // ✅ Keywords
  const KEYWORDS = ["cricket", "science"];

  const containsKeyword = (text: string) =>
    KEYWORDS.some((k) => text.toLowerCase().includes(k));

  const showNotification = (tweetContent: string) => {
    if (typeof window === "undefined") return;
    if (!("Notification" in window)) return;
    if (Notification.permission !== "granted") return;

    new Notification("Important Tweet 🚨", {
      body: tweetContent,
    });
  };

  // ✅ Request notification permission on mount
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }
  }, []);

  const fetchTweets = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/post");
      const data: Tweet[] = res.data;

      setTweets(data);

      if (!user?.notificationsEnabled) return;

      data.forEach((tweet) => {
        if (
          containsKeyword(tweet.content) &&
          !notifiedTweetIds.current.has(tweet._id)
        ) {
          showNotification(tweet.content);
          notifiedTweetIds.current.add(tweet._id);
        }
      });
    } catch (err) {
      console.error("Error fetching tweets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTweets();
    }
  }, [user]);

  const handleNewTweet = (newTweet: Partial<Tweet>) => {
    if (!user) return;

    const completedTweet: Tweet = {
      _id: newTweet._id!,
      content: newTweet.content!,
      author: {
        _id: user._id,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
      },
      likes: 0,
      retweets: 0,
      comments: 0,
      image: newTweet.image,
      likedBy: [],
      retweetedBy: [],
      timestamp: new Date().toISOString(),
    };

    setTweets((prev) => [completedTweet, ...prev]);

    if (
      user.notificationsEnabled &&
      containsKeyword(completedTweet.content) &&
      !notifiedTweetIds.current.has(completedTweet._id)
    ) {
      showNotification(completedTweet.content);
      notifiedTweetIds.current.add(completedTweet._id);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 bg-black/90 backdrop-blur-md border-b border-gray-800 z-10">
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold text-white">Home</h1>
        </div>

        <Tabs defaultValue="foryou">
          <TabsList className="grid w-full grid-cols-2 bg-transparent border-b border-gray-800 rounded-none">
            <TabsTrigger value="foryou">For you</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <TweetComposer onTweetPosted={handleNewTweet} />

      <div className="divide-y divide-gray-800">
        {loading ? (
          <Card className="bg-black border-none">
            <CardContent className="py-12 text-center">
              <LoadingSpinner size="lg" className="mx-auto mb-4" />
              <p className="text-gray-400">Loading tweets...</p>
            </CardContent>
          </Card>
        ) : (
          tweets.map((tweet) => (
            <TweetCard key={tweet._id} tweet={tweet} />
          ))
        )}
      </div>
    </div>
  );
};

export default Feed;

interface Author {
  _id: string;
  username: string;
  displayName: string;
  avatar: string;
  verified?: boolean;
}

interface Tweet {
  _id: string;
  author: Author;
  content: string;
  image?: string;
  likes: number;
  retweets: number;
  comments: number;
  likedBy?: string[];
  retweetedBy?: string[];
  timestamp?: string;
}