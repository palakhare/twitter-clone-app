import express from "express";
import multer from "multer";
import Tweet from "../modals/Tweet.js";

const router = express.Router();

const upload = multer({
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
});

// ⏰ IST time check
function isWithinISTWindow() {
  const now = new Date();
  const istHour = (now.getUTCHours() + 5.5) % 24;
  return istHour >= 14 && istHour < 19;
}

router.post("/audio", upload.single("audio"), async (req, res) => {
  try {
    if (!isWithinISTWindow()) {
      return res.status(403).json({
        error: "Audio tweets allowed only between 2 PM – 7 PM IST",
      });
    }

    const { audioDuration } = req.body;

    if (audioDuration > 300) {
      return res.status(400).json({ error: "Audio exceeds 5 minutes" });
    }

    // ⚠️ Replace with Cloudinary/S3 upload
    const fakeAudioUrl = `/uploads/${req.file.filename}`;

    const tweet = await Tweet.create({
      user: req.user._id,
      isAudioTweet: true,
      audioUrl: fakeAudioUrl,
      audioDuration,
    });

    res.json(tweet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
