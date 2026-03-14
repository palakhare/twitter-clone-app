import React from "react"
import axios from "axios"

const plans = [
 { name:"FREE",price:0 },
 { name:"BRONZE",price:100 },
 { name:"SILVER",price:300 },
 { name:"GOLD",price:1000 }
]

const SubscriptionPage = ()=>{

 const handleSubscribe = async(planName)=>{

  if(planName === "FREE"){
   alert("Free plan is default")
   return
  }

  try{

   // STEP 1 → Create Order (Time restricted backend)
   const order = await axios.post(
    "/payment/create-order",
    {plan:planName}
   )

   // STEP 2 → Simulated Payment Success
   await axios.post(
    "/payment/verify",
    {plan:planName}
   )

   alert(`${planName} Plan Activated`)

  }catch(err){
   alert(err.response?.data?.msg || "Payment Failed")
  }
 }

 return(
  <div style={{padding:"40px"}}>

   <h2>Choose Subscription Plan</h2>

   <div style={{display:"flex",gap:"20px",marginTop:"30px"}}>

    {plans.map((plan)=>(
     <div
      key={plan.name}
      style={{
       border:"1px solid #ccc",
       padding:"20px",
       width:"200px"
      }}
     >

      <h3>{plan.name}</h3>

      <p>
       {plan.price === 0
        ? "Free"
        : `₹${plan.price}/month`}
      </p>

      <button
       onClick={()=>handleSubscribe(plan.name)}
      >
       Select
      </button>

     </div>
    ))}

   </div>

  </div>
 )
}

export default SubscriptionPage