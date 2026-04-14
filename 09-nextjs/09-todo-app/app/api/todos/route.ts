import { NextResponse } from "next/server";
import { db } from "@/lib/store";

// GET /api/todos — returns all todos
export async function GET() {
  return NextResponse.json(db.getAll());
}

// POST /api/todos — creates a new todo
export async function POST(req: Request) {
  const { text } = await req.json();

  if (!text?.trim()) {
    return NextResponse.json({ error: "Text is required" }, { status: 400 });
  }

  const todo = db.add(text.trim());
  return NextResponse.json(todo, { status: 201 });
}