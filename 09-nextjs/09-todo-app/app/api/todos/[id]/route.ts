import { NextResponse } from "next/server";
import { db } from "@/lib/store";

// DELETE /api/todos/[id] — removes a todo by id
export async function DELETE(
  _req: Request,
  // Need Promise here after Next JS 15 //
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const deleted = db.delete(id);

  if (!deleted) {
    return NextResponse.json({ error: "Todo not found" }, { status: 404 });
  }

  return new NextResponse(null, { status: 204 });
}