import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  await connectDB();

  const data = await req.json();

  const user = new User(data);
  await user.save();

  return NextResponse.json({ message: "User created" });
}
