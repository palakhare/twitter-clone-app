"use client";

import axios from "@/lib/axios";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const handlePayment = async (plan: string) => {
  try {

    //  Create Order from backend
    const res = await axios.post("/api/subscription/create-order", { plan });

    const order = res.data.order;

    //  Razorpay options
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      name: "Twitter Clone",
      description: `${plan} Subscription`,
      order_id: order.id,

      handler: async function (response: any) {

        //  Verify Payment
        await axios.post("/api/subscription/verify-payment", {
          ...response,
          plan,
        });

        alert("Subscription Activated");
      },

      theme: {
        color: "#3399cc",
      },
    };

    //  Open Razorpay
    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (err) {
    console.error("Payment Failed", err);
  }
};