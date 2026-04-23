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

    // For Instagram Business Login (IGAAR tokens), the token is already long-lived (60 days)
    // No separate exchange step needed
    const longToken = shortToken;
    console.log("Using token directly (IGAAR tokens are long-lived)");

    // 3. Save token + IG user ID
    await updateAuthConfig(longToken, String(igUserId));

    return NextResponse.redirect(new URL("/dashboard?success=connected", req.url));
  } catch (error) {
    console.error("OAuth Callback Error", error);
    return NextResponse.redirect(new URL("/settings?error=internal", req.url));
  }
}
