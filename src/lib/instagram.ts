import { getAllConfigs } from "./configManager";

const GRAPH_API_URL = "https://graph.instagram.com";

async function getAccessToken() {
  const config = await getAllConfigs();
  if (config.is_disconnected) return undefined;
  return config.instagram_access_token || process.env.INSTAGRAM_ACCESS_TOKEN;
}

export async function getLongLivedToken(shortToken: string) {
  const appId = process.env.NEXT_PUBLIC_FB_APP_ID;
  const appSecret = process.env.FB_APP_SECRET;
  
  const response = await fetch(
    `https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${shortToken}`
  );
  return response.json();
}

export async function getInstagramBusinessAccount(accessToken: string) {
  // 1. Get pages
  const pagesRes = await fetch(`https://graph.facebook.com/v21.0/me/accounts?access_token=${accessToken}`);
  const pagesData = await pagesRes.json();
  const pages = pagesData.data || [];

  for (const page of pages) {
    // 2. For each page, check for linked IG business account
    const igRes = await fetch(`https://graph.facebook.com/v21.0/${page.id}?fields=instagram_business_account&access_token=${accessToken}`);
    const igData = await igRes.json();
    if (igData.instagram_business_account) {
      return igData.instagram_business_account.id;
    }
  }
  return null;
}

export async function sendDm(commentId: string, message: string) {
  const url = new URL(`${GRAPH_API_URL}/me/messages`);
  const accessToken = await getAccessToken();
  url.searchParams.append("access_token", accessToken || "");

  const payload = {
    recipient: { comment_id: commentId },
    message: { text: message }
  };

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  if (data.error) console.error("Instagram DM Error:", data.error);
  return data;
}

export async function replyToComment(commentId: string, message: string) {
  const url = new URL(`https://graph.facebook.com/v21.0/${commentId}/replies`);
  
  const payload = new URLSearchParams();
  payload.append('message', message);
  const accessToken = await getAccessToken();
  payload.append('access_token', accessToken || "");

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: payload
  });

  const data = await response.json();
  if (data.error) console.error("Instagram Reply Error for comment", commentId, ":", data.error);
  return data;
}

export async function getAccountMedia() {
  const accessToken = await getAccessToken();

  const response = await fetch(`https://graph.instagram.com/v21.0/me/media`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      access_token: accessToken || "",
      fields: "id,media_type,media_url,thumbnail_url,permalink,caption",
      limit: "100",
    }),
  });
  const data = await response.json();

  if (data.error) {
    console.error(`Instagram API Error:`, data.error);
    return [];
  }

  return data.data || [];
}

export async function getAccountProfile() {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    console.warn("No access token available");
    return null;
  }

  // IGAAR tokens work with graph.instagram.com/me
  const url = new URL(`https://graph.instagram.com/v21.0/me`);
  url.searchParams.append("fields", "id,username,name");

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      access_token: accessToken,
      fields: "id,username,name", 
    }),
  });
  const data = await response.json();

  if (data.error) {
    console.error(`Instagram Profile API Error:`, data.error);
    return null;
  }

  return data;
}

