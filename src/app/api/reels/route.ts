import { NextResponse } from "next/server";
import { getAccountMedia } from "@/lib/instagram";
import { getAllConfigs } from "@/lib/configManager";

export async function GET() {
  try {
    const mediaItems = await getAccountMedia();
    const configs = await getAllConfigs();
    
    const reels = [];
    for (const item of mediaItems) {
      const mediaId = item.id;
      const config = configs.reels[mediaId] || configs.default;
      
      reels.push({
        id: mediaId,
        thumbnail_url: item.thumbnail_url || item.media_url,
        permalink: item.permalink,
        caption: item.caption?.substring(0, 100) || "",
        config
      });
    }
    
    return NextResponse.json({ reels, total: reels.length });
  } catch (e: any) {
    return NextResponse.json({ detail: e.message || "Error" }, { status: 500 });
  }
}
