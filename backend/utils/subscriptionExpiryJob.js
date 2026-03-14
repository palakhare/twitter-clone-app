import cron from "node-cron"
import Subscription from "../modals/Subscription.js"

cron.schedule("0 0 * * *", async () => {
  try {
    const expired = await Subscription.find({
      status: "ACTIVE",
      endDate: { $lt: new Date() }
    })

    for (const sub of expired) {
      sub.plan = "FREE"
      sub.tweetLimit = 1
      sub.tweetsUsed = 0
      sub.status = "EXPIRED"

      await sub.save()
    }

    if (expired.length > 0) {
      console.log(`Expired ${expired.length} subscriptions`)
    }

  } catch (err) {
    console.error("Subscription expiry job failed:", err.message)
  }
})