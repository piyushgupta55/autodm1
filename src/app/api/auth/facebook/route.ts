import { NextResponse } from "next/server";

export async function GET(req: any) {
  const appId = process.env.NEXT_PUBLIC_FB_APP_ID;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (() => {
    const protocol = req.headers.get("x-forwarded-proto") || "http";
    const host = req.headers.get("host");
    return `${protocol}://${host}`;
  })();

  const redirectUri = `${baseUrl}/api/auth/callback`;
  const scope = "instagram_business_basic,instagram_business_manage_comments,instagram_business_manage_messages";
  const instaLoginUrl = `https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&response_type=code`;

  console.log("=== Instagram OAuth Debug ===");
  console.log("App ID:", appId);
  console.log("Base URL:", baseUrl);
  console.log("Redirect URI:", redirectUri);
  console.log("Full OAuth URL:", instaLoginUrl);
  console.log("=============================");
  
  return NextResponse.redirect(instaLoginUrl);
}
