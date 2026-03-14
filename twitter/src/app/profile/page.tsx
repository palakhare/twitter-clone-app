"use client";

import { useEffect, useState } from "react";

export default function ProfilePage() {

  const [history,setHistory] = useState([]);

  useEffect(()=>{

    fetch("/api/login-history",{
      method:"POST",
      headers:{ "Content-Type":"application/json"},
      body: JSON.stringify({ userId:"USER_ID"})
    })
    .then(res=>res.json())
    .then(data=>setHistory(data));

  },[]);

  return (

    <div className="p-6 text-white">

      <h1 className="text-2xl mb-4">Login History</h1>

      {history.map((item:any)=>(
        <div key={item._id} className="border p-3 mb-2">

          <p>Browser: {item.browser}</p>
          <p>OS: {item.os}</p>
          <p>Device: {item.device}</p>
          <p>IP: {item.ip}</p>
          <p>Time: {new Date(item.loginTime).toLocaleString()}</p>

        </div>
      ))}

    </div>
  );
}