import { NextRequest, NextResponse } from "next/server";
import { getLongLivedToken, getInstagramBusinessAccount } from "@/lib/instagram";
import { updateAuthConfig } from "@/lib/configManager";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/settings?error=no_code", req.url));
  }

  try {
    const protocol = req.headers.get("x-forwarded-proto") || "http";
    const host = req.headers.get("host");
    const redirectUri = `${protocol}://${host}/api/auth/callback`;
    const appId = process.env.NEXT_PUBLIC_FB_APP_ID || "959311050110497";
    const appSecret = process.env.FB_APP_SECRET || "943046142641ebaa6565cdca2cc738c1";

    // 1. Exchange code for short-lived token
    const tokenRes = await fetch(
      `https://graph.facebook.com/v21.0/oauth/access_token?client_id=${appId}&redirect_uri=${redirectUri}&client_secret=${appSecret}&code=${code}`
    );
    const tokenData = await tokenRes.json();
    const shortToken = tokenData.access_token;

    if (!shortToken) {
      console.error("Failed to get short token", tokenData);
      return NextResponse.redirect(new URL("/settings?error=token_failed", req.url));
    }

    // 2. Exchange for long-lived token
    const longTokenData = await getLongLivedToken(shortToken);
    const longToken = longTokenData.access_token;

    if (!longToken) {
       console.error("Failed to get long token", longTokenData);
       return NextResponse.redirect(new URL("/settings?error=long_token_failed", req.url));
    }

    // 3. Find Instagram Business Account
    const igId = await getInstagramBusinessAccount(longToken);

    if (!igId) {
      return NextResponse.redirect(new URL("/settings?error=no_ig_account", req.url));
    }

    // 4. Save to config
    updateAuthConfig(longToken, igId);

    return NextResponse.redirect(new URL("/settings?success=connected", req.url));
  } catch (error) {
    console.error("OAuth Callback Error", error);
    return NextResponse.redirect(new URL("/settings?error=internal", req.url));
  }
}
