import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import languageRoutes from "./routes/languageRoutes.js";
import tweetRoutes from "./routes/tweetRoutes.js";
import otpRoutes from "./routes/otp.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import authRoutes from "./routes/auth.js";

import User from "./modals/user.js";
import Tweet from "./modals/Tweet.js";

import "./utils/subscriptionExpiryJob.js";

const app = express();

/* ---------------- MIDDLEWARE ---------------- */

app.use(express.json());

/* ---------------- CORS ---------------- */

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
];

app.use(
  cors({
    origin: (origin, callback) => {

      if (!origin) return callback(null, true);

      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
  })
);
app.set("trust proxy", 1);
/* ---------------- ROUTES ---------------- */

app.use("/api/language", languageRoutes);
app.use("/api/tweet", tweetRoutes);
app.use("/otp", otpRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/subscription", subscriptionRoutes);

/* ---------------- KEYWORDS ---------------- */

const KEYWORDS = ["cricket", "science"];

/* ---------------- HEALTH ---------------- */

app.get("/", (req, res) => {
  res.json({ message: "Backend running successfully" });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});
/* ---------------- DB CONNECTION ---------------- */

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI missing in .env file");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

/* ---------------- USER ROUTES ---------------- */
app.get("/loggedinuser", async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: "Email required" });
    }

    const user = await User.findOne({ email }).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch("/userupdate/:email", async (req, res) => {
  try {
    const { email } = req.params;

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: req.body },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const safeUser = await User.findById(updatedUser._id).select("-password");
res.status(200).json(safeUser);
    
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.patch("/user/notifications/:email", async (req, res) => {
  try {
    const { enabled } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { email: req.params.email },
      { notificationsEnabled: enabled },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/* ---------------- TWEET ROUTES ---------------- */

app.post("/post", async (req, res) => {
  try {

    const user = await User.findById(req.body.author);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.subscription === "free" && user.tweetsThisMonth >= 1) {
      return res.status(403).json({
        message: "Free plan allows only 1 tweet per month. Upgrade to Premium."
      });
    }

    const tweet = new Tweet({
      ...req.body,
      timestamp: new Date()
    });

    await tweet.save();

    user.tweetsThisMonth += 1;
    await user.save();

    res.status(201).send(tweet);

  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.get("/post", async (req, res) => {
  try {
    const tweets = await Tweet.find()
      .sort({ timestamp: -1 })
      .populate("author");

    res.status(200).send(tweets);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.post("/like/:tweetid", async (req, res) => {
  try {
    const { userId } = req.body;

    const tweet = await Tweet.findById(req.params.tweetid);

    if (!tweet) {
      return res.status(404).json({ error: "Tweet not found" });
    }

    if (!tweet.likedBy.includes(userId)) {
      tweet.likes += 1;
      tweet.likedBy.push(userId);
      await tweet.save();
    }

    res.send(tweet);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.post("/retweet/:tweetid", async (req, res) => {
  try {
    const { userId } = req.body;

    const tweet = await Tweet.findById(req.params.tweetid);

    if (!tweet) {
      return res.status(404).json({ error: "Tweet not found" });
    }

    if (!tweet.retweetedBy.includes(userId)) {
      tweet.retweets += 1;
      tweet.retweetedBy.push(userId);
      await tweet.save();
    }

    res.send(tweet);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});
