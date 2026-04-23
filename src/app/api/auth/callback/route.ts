import { NextRequest, NextResponse } from "next/server";
import { updateAuthConfig } from "@/lib/configManager";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/settings?error=no_code", req.url));
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${req.headers.get("x-forwarded-proto") || "http"}://${req.headers.get("host")}`;
    const redirectUri = `${baseUrl}/api/auth/callback`;
    const appId = process.env.NEXT_PUBLIC_FB_APP_ID;
    const appSecret = process.env.FB_APP_SECRET;

    // 1. Exchange code for short-lived token via Instagram API
    const tokenRes = await fetch(
      `https://api.instagram.com/oauth/access_token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: appId || "",
          client_secret: appSecret || "",
          grant_type: "authorization_code",
          redirect_uri: redirectUri,
          code,
        }),
      }
    );
    const tokenData = await tokenRes.json();
    console.log("Short token response:", JSON.stringify(tokenData));
    const shortToken = tokenData.access_token;
    const igUserId = tokenData.user_id;

    if (!shortToken) {
      console.error("Failed to get short token", tokenData);
      return NextResponse.redirect(new URL("/settings?error=token_failed", req.url));
    }

    // 2. Exchange for long-lived token (60 days)
    const longTokenRes = await fetch(
      `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${appSecret}&access_token=${shortToken}`
    );
    const longTokenData = await longTokenRes.json();
    console.log("Long-lived token response:", JSON.stringify(longTokenData));
    const longToken = longTokenData.access_token || shortToken;

    // 3. Fetch profile using igUserId
    const profileRes = await fetch(
      `https://graph.instagram.com/v21.0/${igUserId}?fields=id,name,username,profile_picture_url,followers_count,biography,website&access_token=${longToken}`
    );
    const profileData = await profileRes.json();
    console.log("Profile data:", JSON.stringify(profileData));

    if (profileData.error) {
      console.error("Profile fetch failed:", profileData.error.message);
    }

    // 4. Save token + IG user ID
    await updateAuthConfig(longToken, String(igUserId));

    return NextResponse.redirect(new URL("/dashboard?success=connected", req.url));
  } catch (error) {
    console.error("OAuth Callback Error", error);
    return NextResponse.redirect(new URL("/settings?error=internal", req.url));
  }
}
