import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForToken, getAccountProfile } from "@/lib/instagram";
import { updateAuthConfig } from "@/lib/configManager";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code) {
    return NextResponse.redirect(new URL("/dashboard?error=no_code", req.url));
  }

  try {
    // 1. Exchange code for token (using the new platform API)
    const tokenData = await exchangeCodeForToken(code);
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      throw new Error("Failed to get access token");
    }

    // 2. Get Instagram Profile info
    const profile = await getAccountProfile(accessToken);
    const instagramId = profile?.id;

    if (!instagramId) {
      throw new Error("Failed to get Instagram profile info");
    }

    // 3. Update database
    await updateAuthConfig(accessToken, instagramId);

    // 4. Redirect to dashboard
    return NextResponse.redirect(new URL("/dashboard?success=connected", req.url));
  } catch (error) {
    console.error("Legacy OAuth Callback Error:", error);
    return NextResponse.redirect(new URL("/dashboard?error=callback_failed", req.url));
  }
}
