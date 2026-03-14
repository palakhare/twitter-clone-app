import express from "express";
import { createTweet, getTweets } from "../controllers/tweetController.js";

const router = express.Router();

router.post("/post", createTweet);
router.get("/post", getTweets);

export default router;