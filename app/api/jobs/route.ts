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
// Yahan humne ': Request' add kiya hai error fix karne ke liye
export async function POST(request: Request) {
  const { title, company } = await request.json();
  await connectToDatabase();
  const newJob = await Job.create({ title, company });
  return NextResponse.json(newJob);
}

// 3. DELETE: Job delete karne ke liye
export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const { id } = await request.json(); 
    await Job.findByIdAndDelete(id);
    return NextResponse.json({ message: "Job deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete job" }, { status: 500 });
  }
}

// 4. PATCH: Status update karne ke liye
export async function PATCH(request: Request) {
  try {
    await connectToDatabase();
    const { id, status } = await request.json();
    await Job.findByIdAndUpdate(id, { status });
    return NextResponse.json({ message: "Status updated" });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}