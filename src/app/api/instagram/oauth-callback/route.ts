import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForToken, getAccountProfile } from "@/lib/instagram";
import { updateAuthConfig } from "@/lib/configManager";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

  if (error) {
    console.error("OAuth Error:", error);
    return NextResponse.redirect(`${frontendUrl}/dashboard?error=auth_failed&message=${error}`);
  }

  if (!code) {
    return NextResponse.redirect(`${frontendUrl}/dashboard?error=missing_code`);
  }

  try {
    // 1. Exchange code for token
    const tokenData = await exchangeCodeForToken(code);
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      throw new Error("No access token received");
    }

    // 2. Get Instagram Profile info
    const profile = await getAccountProfile(accessToken);
    const instagramId = profile?.id;

    if (!instagramId) {
      throw new Error("Failed to get Instagram profile info");
    }

    // 3. Update database
    // Note: We use 'main' as the ID for now as per current project architecture
    await updateAuthConfig(accessToken, instagramId);

    // 4. Redirect back to dashboard
    return NextResponse.redirect(`${frontendUrl}/dashboard?success=true&username=${profile.username}`);
  } catch (err: any) {
    console.error("OAuth Callback Error:", err);
    return NextResponse.redirect(`${frontendUrl}/dashboard?error=callback_failed&message=${encodeURIComponent(err.message)}`);
  }
}
