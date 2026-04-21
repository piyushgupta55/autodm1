import { NextRequest, NextResponse } from "next/server";
import { getReelConfig } from "@/lib/configManager";
import { replyToComment, sendDm } from "@/lib/instagram";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const hubMode = searchParams.get("hub.mode");
  const hubVerifyToken = searchParams.get("hub.verify_token");
  const hubChallenge = searchParams.get("hub.challenge");

  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  if (hubMode === "subscribe" && hubVerifyToken === VERIFY_TOKEN) {
    return new NextResponse(hubChallenge, { status: 200 });
  }
  return new NextResponse("Verification failed", { status: 403 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.object !== "instagram") {
      return NextResponse.json({ status: "ignored" });
    }

    const entries = body.entry || [];
    for (const entry of entries) {
      const changes = entry.changes || [];
      for (const change of changes) {
        if (change.field === "comments") {
          const value = change.value || {};
          const commentId = value.id;
          const commentText = (value.text || "").trim().toLowerCase();
          const mediaId = value.media?.id;

          if (!commentId || !mediaId) continue;

          const config = getReelConfig(mediaId);

          if (!config.active) continue;

          const trigger = (config.trigger_keyword || "").toLowerCase();
          if (trigger && commentText.includes(trigger)) {
            const dmMessage = config.dm_message || "";
            const commentReply = config.comment_reply || "";

            if (commentReply) {
              await replyToComment(commentId, commentReply);
            }
            if (dmMessage) {
              await sendDm(commentId, dmMessage);
            }
          }
        }
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Webhook error", error);
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}
