
import Tweet from "../modals/Tweet.js";

const KEYWORDS = ["cricket", "science"];

export const createTweet = async (req, res) => {

  try {

    const content = req.body.content || "";

    const hasKeyword = KEYWORDS.some(keyword =>
      content.toLowerCase().includes(keyword)
    );

    const tweet = new Tweet({
      ...req.body,
      hasKeyword,
      timestamp: new Date()
    });

    await tweet.save();

    res.status(201).json(tweet);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }

};

export const getTweets = async (req, res) => {

  try {

    const tweets = await Tweet.find()
      .sort({ timestamp: -1 })
      .populate("author");

    res.json(tweets);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }

};