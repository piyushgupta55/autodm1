import { NextRequest, NextResponse } from "next/server";
import { getReelConfig, updateReelConfig } from "@/lib/configManager";

export async function GET(req: NextRequest, { params }: { params: Promise<{ media_id: string }> | { media_id: string } }) {
  const mediaId = (await params).media_id;
  const config = getReelConfig(mediaId);
  return NextResponse.json({ media_id: mediaId, config });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ media_id: string }> | { media_id: string } }) {
  try {
    const mediaId = (await params).media_id;
    const config = await req.json();
    updateReelConfig(mediaId, config);
    return NextResponse.json({ status: "updated", media_id: mediaId });
  } catch (e: any) {
    return NextResponse.json({ detail: e.message || "Error" }, { status: 500 });
  }
}
