import { NextRequest, NextResponse } from "next/server";
import { publishPost } from "@/lib/instagram";

export async function POST(req: NextRequest) {
  try {
    const { imageUrl, caption } = await req.json();

    if (!imageUrl || !caption) {
      return NextResponse.json({ error: "Missing imageUrl or caption" }, { status: 400 });
    }

    const result = await publishPost(imageUrl, caption);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Publish Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
