import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Job from "@/lib/models/Job";

// 1. GET: Saari jobs database se lane ke liye
export async function GET() {
  await connectToDatabase();
  const jobs = await Job.find({}).sort({ createdAt: -1 });
  return NextResponse.json(jobs);
}

// 2. POST: Nayi job save karne ke liye
export async function POST(request) {
  const { title, company } = await request.json();
  await connectToDatabase();
  const newJob = await Job.create({ title, company });
  return NextResponse.json(newJob);
}