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

    // STEP 1: Exchange code for short-lived token
    const tokenRes = await fetch(`https://api.instagram.com/oauth/access_token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: appId || "",
        client_secret: appSecret || "",
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
        code,
      }),
    });
    const tokenData = await tokenRes.json();
    console.log("Short token response:", JSON.stringify(tokenData));

    const shortToken = tokenData.access_token;
    const igUserId = String(tokenData.user_id);

    if (!shortToken) {
      console.error("Failed to get short token:", tokenData);
      return NextResponse.redirect(new URL("/settings?error=token_failed", req.url));
    }

    // STEP 2: Exchange for long-lived token (60 days) using Instagram's endpoint
    const longTokenRes = await fetch(
      `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${appSecret}&access_token=${shortToken}`
    );
    const longTokenData = await longTokenRes.json();
    console.log("Long token response:", JSON.stringify(longTokenData));

    const longToken = longTokenData.access_token;
    if (!longToken) {
      console.error("Failed to get long token:", longTokenData);
      return NextResponse.redirect(new URL(`/settings?error=long_token_failed&detail=${encodeURIComponent(longTokenData?.error?.message || "unknown")}`, req.url));
    }

    // STEP 3: Fetch profile using long-lived token + igUserId
    const profileRes = await fetch(
      `https://graph.instagram.com/v21.0/${igUserId}?fields=id,name,username,profile_picture_url,followers_count,biography,website&access_token=${longToken}`
    );
    const profileData = await profileRes.json();
    console.log("Profile data:", JSON.stringify(profileData));

    if (profileData.error) {
      console.error("Profile fetch failed:", profileData.error.message);
    }

    // STEP 4: Save to Supabase
    await updateAuthConfig(longToken, igUserId, profileData.error ? null : profileData);

    return NextResponse.redirect(new URL("/dashboard?success=connected", req.url));
  } catch (error) {
    console.error("OAuth Callback Error:", error);
    return NextResponse.redirect(new URL("/settings?error=internal", req.url));
  }
}
