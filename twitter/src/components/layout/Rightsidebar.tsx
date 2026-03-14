"use client";

import React from "react";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useRouter } from "next/navigation";

export default function RightSidebar() {

  const router = useRouter();

  const suggestions = [
    {
      id: "1",
      username: "narendramodi",
      displayName: "Narendra Modi",
      avatar:
        "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg",
      verified: true
    },
    {
      id: "2",
      username: "akshaykumar",
      displayName: "Akshay Kumar",
      avatar:
        "https://images.pexels.com/photos/1382735/pexels-photo-1382735.jpeg",
      verified: true
    },
    {
      id: "3",
      username: "rashtrapatibhvn",
      displayName: "President of India",
      avatar:
        "https://images.pexels.com/photos/1080213/pexels-photo-1080213.jpeg",
      verified: true
    }
  ];

  return (
    <div className="w-80 p-4 space-y-4">

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          placeholder="Search"
          className="pl-12 bg-gray-900 border-gray-800 text-white placeholder-gray-400 rounded-full py-3"
        />
      </div>

      {/* Premium Card */}
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-4">
          <h3 className="text-white text-xl font-bold mb-2">
            Subscribe to Premium
          </h3>

          <p className="text-gray-400 text-sm mb-4">
            Subscribe to unlock new features and if eligible, receive a share
            of revenue.
          </p>

          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full"
            onClick={() => router.push("/subscription")}
          >
            Subscribe
          </Button>

          <p className="text-gray-400 text-sm mb-4">
            Current Plan: Free (1 tweet/month)
          </p>
          
        </CardContent>
      </Card>

      {/* Who to follow */}
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-4">

          <h3 className="text-white text-xl font-bold mb-4">
            You might like
          </h3>

          <div className="space-y-4">
            {suggestions.map((user) => (
              <div key={user.id} className="flex items-center justify-between">

                <div className="flex items-center space-x-3">

                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>
                      {user.displayName[0]}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <span className="text-white font-semibold">
                      {user.displayName}
                    </span>

                    <div className="text-gray-400 text-sm">
                      @{user.username}
                    </div>
                  </div>

                </div>

                <Button
                  variant="outline"
                  className="bg-white text-black hover:bg-gray-200 rounded-full px-4"
                >
                  Follow
                </Button>

              </div>
            ))}
          </div>

        </CardContent>
      </Card>

    </div>
  );
}