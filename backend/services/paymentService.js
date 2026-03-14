const { v4: uuidv4 } = require("uuid")

exports.createOrder = (plan)=>{
 return {
  orderId:"order_"+uuidv4(),
  amount:{
   BRONZE:100,
   SILVER:300,
   GOLD:1000
  }[plan]
 }
}

exports.verifyPayment = ()=>{
 return {
  paymentId:"pay_"+uuidv4(),
  status:"SUCCESS"
 }
}