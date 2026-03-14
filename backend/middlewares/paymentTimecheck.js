const paymentTimeCheck = (req, res, next) => {

  const now = new Date().toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour12: false
  })

  if (now < "10:00:00" || now > "11:00:00") {
    return res.status(403).json({
      msg: "Payments allowed only between 10AM–11AM IST"
    })
  }

  next()
}

export default paymentTimeCheck