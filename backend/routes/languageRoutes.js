import express from "express";
import {
  sendLanguageOtp,
  verifyLanguageOtp
} from "../controllers/languageController.js";

const router = express.Router();

router.post("/send-otp", sendLanguageOtp);
router.post("/verify-otp", verifyLanguageOtp);

export default router;