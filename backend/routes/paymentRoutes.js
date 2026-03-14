import express from "express"

import paymentTimeCheck from "../middlewares/paymentTimecheck.js"
import {
  createOrderController,
  verifyPaymentController
} from "../controllers/paymentController.js"

import auth from "../middlewares/auth.js"

const router = express.Router()

router.post(
  "/create-order",
  auth,
  paymentTimeCheck,
  createOrderController
)

router.post(
  "/verify-payment",
  auth,
  verifyPaymentController
)

export default router