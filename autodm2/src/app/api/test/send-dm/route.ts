import { NextRequest, NextResponse } from "next/server";
import { sendDm } from "@/lib/instagram";

export async function POST(req: NextRequest) {
  try {
    const { comment_id, message } = await req.json();
    const result = await sendDm(comment_id, message);
    return NextResponse.json({ status: "success", result });
  } catch (e: any) {
    return NextResponse.json({ detail: e.message || "Error" }, { status: 500 });
  }
}
