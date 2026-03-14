
"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Heart, MessageCircle, Repeat2, Share } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import axios from "@/lib/axios";

const KEYWORDS = ["cricket", "science"];

const containsKeyword = (text: string) =>
  KEYWORDS.some((k) => text.toLowerCase().includes(k));

interface Author {
  _id: string;
  username: string;
  displayName: string;
  avatar: string;
}

interface Tweet {
  _id: string;
  author: Author;
  content: string;

  image?: string;

  // 🔊 Audio tweet
  audioUrl?: string;
  audioDuration?: number;
  isAudioTweet?: boolean;

  likes: number;
  retweets: number;
  comments: number;
  likedBy?: string[];
  retweetedBy?: string[];
}

interface TweetCardProps {
  tweet: Tweet;
}

export default function TweetCard({ tweet }: TweetCardProps) {
  const { user } = useAuth();
  const [tweetState, setTweetState] = useState(tweet);
  const notifiedRef = useRef(false);

  useEffect(() => {
    if (!user || !user.notificationsEnabled) return;
    if (!("Notification" in window)) return;

    const notify = async () => {
      if (Notification.permission === "default") {
        await Notification.requestPermission();
      }

      if (
        Notification.permission === "granted" &&
        containsKeyword(tweetState.content) &&
        !notifiedRef.current
      ) {
        new Notification("Important Tweet 🚨", {
          body: tweetState.content,
        });
        notifiedRef.current = true;
      }
    };

    notify();
  }, [tweetState.content, user]);

  const likeTweet = async () => {
    if (!user) return;
    const res = await axios.post(`/like/${tweetState._id}`, {
      userId: user._id,
    });
    setTweetState(res.data);
  };

  const retweetTweet = async () => {
    if (!user) return;
    const res = await axios.post(`/retweet/${tweetState._id}`, {
      userId: user._id,
    });
    setTweetState(res.data);
  };

  const isLiked = tweetState.likedBy?.includes(user?._id || "");
  const isRetweet = tweetState.retweetedBy?.includes(user?._id || "");

  return (
    <Card className="bg-black border-gray-800 border-x-0 border-t-0 rounded-none">
      <CardContent className="p-4">
        <div className="flex space-x-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={tweetState.author.avatar} />
            <AvatarFallback>
              {tweetState.author.displayName[0]}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex space-x-2 mb-2">
              <span className="font-bold text-white">
                {tweetState.author.displayName}
              </span>
              <span className="text-gray-500">
                @{tweetState.author.username}
              </span>
            </div>

            <p className="text-white mb-3">{tweetState.content}</p>

            {/* 🖼️ Image */}
            {tweetState.image && (
              <div className="mb-3 rounded-xl overflow-hidden">
                <Image
                  src={tweetState.image}
                  alt="Tweet image"
                  width={600}
                  height={400}
                  className="w-full object-cover"
                />
              </div>
            )}

            {/* 🔊 Audio */}
            {tweetState.isAudioTweet && tweetState.audioUrl && (
              <div className="mb-3">
                <audio controls className="w-full">
                  <source src={tweetState.audioUrl} />
                </audio>
              </div>
            )}

            <div className="flex justify-between max-w-md">
              <Button variant="ghost" size="sm">
                <MessageCircle />
                {tweetState.comments}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={retweetTweet}
                className={isRetweet ? "text-green-400" : ""}
              >
                <Repeat2 />
                {tweetState.retweets}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={likeTweet}
                className={isLiked ? "text-red-500" : ""}
              >
                <Heart />
                {tweetState.likes}
              </Button>

              <Button variant="ghost" size="sm">
                <Share />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
