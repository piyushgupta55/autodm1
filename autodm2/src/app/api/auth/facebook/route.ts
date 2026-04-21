import { NextResponse } from "next/server";

export async function GET(req: any) {
  const appId = process.env.NEXT_PUBLIC_FB_APP_ID;
  const protocol = req.headers.get("x-forwarded-proto") || "http";
  const host = req.headers.get("host");
  const redirectUri = encodeURIComponent(`${protocol}://${host}/api/auth/callback`);
  
  const scope = encodeURIComponent("instagram_basic,instagram_manage_comments,instagram_manage_insights,pages_show_list,pages_read_engagement");
  
  const fbLoginUrl = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
  
  return NextResponse.redirect(fbLoginUrl);
}
