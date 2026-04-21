import { NextResponse } from "next/server";
import { getAllConfigs } from "@/lib/configManager";

export async function GET() {
  try {
    const config = await getAllConfigs();

    const hasToken = !!config.instagram_access_token;
    const hasBusinessId = !!config.instagram_business_id;
    const isDisconnected = config.is_disconnected;
    const businessId = config.instagram_business_id;
    const tokenPreview = config.instagram_access_token
      ? config.instagram_access_token.substring(0, 20) + "..."
      : null;

    // Try a live call to Instagram Graph API
    let igApiResult = null;
    if (hasToken && hasBusinessId) {
      const url = new URL(`https://graph.instagram.com/v21.0/me`);
      url.searchParams.append("access_token", config.instagram_access_token!);
      url.searchParams.append("fields", "id,username,name");
      const res = await fetch(url.toString());
      igApiResult = await res.json();
    }

    return NextResponse.json({
      supabase_read: "ok",
      hasToken,
      hasBusinessId,
      isDisconnected,
      businessId,
      tokenPreview,
      igApiResult,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
