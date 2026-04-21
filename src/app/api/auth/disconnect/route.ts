import { NextResponse } from "next/server";
import { clearAuthConfig } from "@/lib/configManager";

export async function POST() {
  await clearAuthConfig();
  return NextResponse.json({ status: "ok" });
}
