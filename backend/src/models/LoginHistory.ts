import mongoose from "mongoose";

const LoginHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    browser: String,
    os: String,
    device: String,
    ip: String,

    loginTime: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

export default mongoose.models.LoginHistory ||
mongoose.model("LoginHistory", LoginHistorySchema);