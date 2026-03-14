import mongoose from "mongoose";

const TweetSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    // 🖼️ Image Tweet
    image: {
      type: String,
      default: null,
    },

    // 🔊 Audio Tweet
    audioUrl: {
      type: String,
      default: null,
    },

    audioDuration: {
      type: Number, // seconds
      default: null,
      max: 300, // ⛔ 5 minutes max (extra safety)
    },

    isAudioTweet: {
      type: Boolean,
      default: false,
    },

    // 🔔 Keyword-based notification flag
    hasKeyword: {
      type: Boolean,
      default: false,
    },

    likes: {
      type: Number,
      default: 0,
    },

    retweets: {
      type: Number,
      default: 0,
    },

    comments: {
      type: Number,
      default: 0,
    },

    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    retweetedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

// Prevent model overwrite error in Next / Nodemon
export default mongoose.models.Tweet ||
  mongoose.model("Tweet", TweetSchema);
