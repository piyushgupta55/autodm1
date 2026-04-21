import { NextResponse } from "next/server";

export async function GET(req: any) {
  const appId = process.env.NEXT_PUBLIC_FB_APP_ID || "959311050110497";
  const protocol = req.headers.get("x-forwarded-proto") || "http";
  const host = req.headers.get("host");
  const redirectUri = encodeURIComponent(`${protocol}://${host}/api/auth/callback`);
  
  // Use Instagram Login for Business Scopes
  const scope = "instagram_business_basic,instagram_business_manage_comments,instagram_business_manage_messages";
  
  const instaLoginUrl = `https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=${appId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
  
  return NextResponse.redirect(instaLoginUrl);
}
