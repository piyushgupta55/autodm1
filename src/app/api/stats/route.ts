import { NextResponse } from "next/server";
import { getAccountMedia } from "@/lib/instagram";
import { getAllConfigs } from "@/lib/configManager";

export async function GET() {
  try {
    const mediaItems = await getAccountMedia();
    const configs = await getAllConfigs();
    
    const total = mediaItems.length;
    let configured = 0;
    let using_default = 0;
    
    for (const item of mediaItems) {
      const mediaId = item.id;
      if (configs.reels[mediaId]) {
        configured++;
      } else {
        using_default++;
      }
    }
    
    return NextResponse.json({
      total_reels: total,
      configured,
      using_default
    });
  } catch (e: any) {
    return NextResponse.json({ detail: e.message || "Error" }, { status: 500 });
  }
}
