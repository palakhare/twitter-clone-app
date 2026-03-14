import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import LoginHistory from "@/models/LoginHistory";

export async function POST(req: Request) {

  await connectDB();

  const { userId } = await req.json();

  const history = await LoginHistory
    .find({ userId })
    .sort({ createdAt: -1 });

  return NextResponse.json(history);
}