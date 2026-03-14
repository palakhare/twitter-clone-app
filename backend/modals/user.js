import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    displayName: {
      type: String,
      required: true,
      trim: true,
    },

    avatar: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    bio: {
      type: String,
      default: "",
      maxlength: 160,
    },

    location: {
      type: String,
      default: "",
    },

    website: {
      type: String,
      default: "",
    },

    joinedDate: {
      type: Date,
      default: Date.now,
    },

    notificationsEnabled: {
      type: Boolean,
      default: true,
    },

    /* PASSWORD RESET CONTROL */

    lastPasswordResetRequest: {
      type: Date,
      default: null,
    },

    /* SUBSCRIPTION SYSTEM */

    subscription: {
      type: String,
      default: "free",
    },

    tweetsThisMonth: {
      type: Number,
      default: 0,
    },

    subscriptionExpiry: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);