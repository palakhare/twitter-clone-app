"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function SubscriptionPlans() {

  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  const plans = [
    {
      name: "bronze",
      title: "Bronze",
      price: "₹100 / month",
      tweets: "3 tweets"
    },
    {
      name: "silver",
      title: "Silver",
      price: "₹300 / month",
      tweets: "5 tweets"
    },
    {
      name: "gold",
      title: "Gold",
      price: "₹1000 / month",
      tweets: "Unlimited tweets"
    }
  ];

  const handleSubscribe = async (plan: string) => {

    if (!user?.email) {
      alert("Please login first");
      return;
    }

    try {

      setLoading(plan);

      const res = await fetch("http://localhost:5001/api/subscription/upgrade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: user.email,
          plan
        })
      });

      const data = await res.json();

      alert(data.message);

    } catch (error) {

      console.error(error);
      alert("Subscription failed");

    } finally {
      setLoading(null);
    }
  };

  return (

    <div className="min-h-screen bg-black text-white flex flex-col items-center py-16">

      <h1 className="text-4xl font-bold mb-12">
        Choose a Plan
      </h1>

      <div className="flex flex-col gap-10 w-full max-w-xl">

        {plans.map((plan) => (

          <div
            key={plan.name}
            className="border border-gray-700 rounded-2xl p-10 text-center"
          >

            <h2 className="text-2xl font-bold mb-3">
              {plan.title}
            </h2>

            <p className="text-gray-400 mb-6">
              {plan.price} — {plan.tweets}
            </p>

            <button
              onClick={() => handleSubscribe(plan.name)}
              disabled={loading === plan.name}
              className="w-full bg-gray-800 hover:bg-gray-700 rounded-lg py-3"
            >
              {loading === plan.name ? "Processing..." : "Subscribe"}
            </button>

          </div>

        ))}

      </div>

    </div>

  );
}