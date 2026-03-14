import mongoose from "mongoose"

const SubscriptionSchema = new mongoose.Schema({

   userId:{
      type: mongoose.Schema.Types.ObjectId,
      ref:"User"
   },

   plan:{
      type:String,
      enum:["FREE","BRONZE","SILVER","GOLD"],
      default:"FREE"
   },

   tweetLimit:{
      type:Number,
      default:1
   },

   tweetsUsed:{
      type:Number,
      default:0
   },

   startDate:Date,
   endDate:Date,

   paymentId:String,

   status:{
      type:String,
      enum:["ACTIVE","EXPIRED"],
      default:"ACTIVE"
   }

})

const Subscription =
   mongoose.models.Subscription ||
   mongoose.model("Subscription", SubscriptionSchema)

export default Subscription