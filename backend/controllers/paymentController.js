
import Subscription from "../modals/Subscription.js"
import User from "../modals/user.js"
import sendInvoiceMail from "../utils/sendInvoiceMail.js"

/* ---------------- CREATE ORDER (SIMULATED) ---------------- */
export const createOrderController = async (req, res) => {
  const { plan } = req.body

  const priceMap = {
    BRONZE: 100,
    SILVER: 300,
    GOLD: 1000
  }

  res.json({
    orderId: "fake_order_123",
    amount: priceMap[plan] || 0
  })
}

/* ---------------- VERIFY PAYMENT (SIMULATED) ---------------- */
export const verifyPaymentController = async (req, res) => {
  try {
    const { plan } = req.body
    const userId = req.user.id

    const planMap = {
      BRONZE: { limit: 3 },
      SILVER: { limit: 5 },
      GOLD: { limit: -1 }
    }

    if (!planMap[plan]) {
      return res.status(400).json({ msg: "Invalid plan selected" })
    }

    await Subscription.findOneAndUpdate(
      { userId },
      {
        plan,
        tweetLimit: planMap[plan].limit,
        tweetsUsed: 0,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: "ACTIVE"
      },
      { upsert: true }
    )

    const user = await User.findById(userId)

    if (user?.email) {
      await sendInvoiceMail(user.email, "")
    }

    res.json({ msg: "Subscription Activated (Simulated Payment)" })

  } catch (err) {
    res.status(500).json({ msg: "Subscription activation failed" })
  }
}