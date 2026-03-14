"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SubscriptionPage() {

  const plans = [
    { name: "bronze", tweets: "3 tweets / month", price: "₹100 / month" },
    { name: "silver", tweets: "5 tweets / month", price: "₹300 / month" },
    { name: "gold", tweets: "Unlimited tweets", price: "₹1000 / month" }
  ];

  // ✅ Put it here
  const handleSubscribe = async (plan: string) => {
    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: "USER_ID",
        plan: plan
      })
    });

    const data = await res.json();

    if (data.success) {
      alert(`Subscribed to ${plan}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex justify-center items-center">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">

        {plans.map((plan) => (
          <Card key={plan.name} className="bg-gray-900 border-gray-800 text-white">

            <CardContent className="p-6 text-center">

              <h2 className="text-2xl font-bold mb-2">
                {plan.name.toUpperCase()}
              </h2>

              <p className="text-gray-400 mb-4">
                {plan.tweets}
              </p>

              <p className="text-xl font-semibold mb-6">
                {plan.price}
              </p>

              <Button
                onClick={() => handleSubscribe(plan.name)}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-full"
              >
                Subscribe
              </Button>

            </CardContent>

          </Card>
        ))}

      </div>

    </div>
  );
}