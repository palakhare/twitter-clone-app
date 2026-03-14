import express from "express"

import auth from "../middlewares/auth.js"
import Subscription from "../modals/Subscription.js"

const router = express.Router()

// GET CURRENT SUBSCRIPTION
router.get("/me", auth, async (req, res) => {
  try {
    const userId = req.user.id

    const subscription = await Subscription.findOne({ userId })

    if (!subscription) {
      return res.status(404).json({ msg: "No subscription found" })
    }

    res.json(subscription)

  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch subscription" })
  }
})

export default router