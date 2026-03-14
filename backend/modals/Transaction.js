const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({

  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },

  plan:String,

  amount:Number,

  status:{
    type:String,
    default:"SUCCESS"
  },

  transactionId:String,

  createdAt:{
    type:Date,
    default:Date.now
  }

})

module.exports = mongoose.model("Transaction",transactionSchema)