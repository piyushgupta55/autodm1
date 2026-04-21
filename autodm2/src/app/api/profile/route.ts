import { NextResponse } from "next/server";
import { getAccountProfile } from "@/lib/instagram";

export async function GET() {
  try {
    const profile = await getAccountProfile();
    return NextResponse.json(profile || { error: "Not found" });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
