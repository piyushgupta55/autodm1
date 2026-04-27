import { NextRequest, NextResponse } from "next/server";
import { getAuthUrl } from "@/lib/instagram";

export async function POST(req: NextRequest) {
  try {
    // In a real app, you'd get this from the session/auth
    // For now, we'll use a placeholder state
    const state = "main"; 
    const authUrl = getAuthUrl(state);

    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error("Connect Error:", error);
    return NextResponse.json({ error: "Failed to generate auth URL" }, { status: 500 });
  }
}

// Support GET for testing/direct links
export async function GET(req: NextRequest) {
  const state = "main";
  const authUrl = getAuthUrl(state);
  return NextResponse.redirect(authUrl);
}
