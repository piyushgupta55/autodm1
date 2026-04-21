import { getAllConfigs } from "./configManager";

const GRAPH_API_URL = "https://graph.instagram.com";

function getAccessToken() {
  const config = getAllConfigs();
  if (config.is_disconnected) return undefined;
  return config.instagram_access_token || process.env.INSTAGRAM_ACCESS_TOKEN;
}

export async function getLongLivedToken(shortToken: string) {
  const appId = process.env.NEXT_PUBLIC_FB_APP_ID || "959311050110497";
  const appSecret = process.env.FB_APP_SECRET || "943046142641ebaa6565cdca2cc738c1";
  
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
  url.searchParams.append("access_token", getAccessToken() || "");

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
  payload.append('access_token', getAccessToken() || "");

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
  const url = new URL(`${GRAPH_API_URL}/me/media`);
  url.searchParams.append("access_token", getAccessToken() || "");
  url.searchParams.append("fields", "id,media_type,media_url,thumbnail_url,permalink,caption");
  url.searchParams.append("limit", "100");

  const response = await fetch(url.toString());
  const data = await response.json();

  if (data.error) {
    console.error(`Instagram API Error:`, data.error);
    return [];
  }

  return data.data || [];
}

export async function getAccountProfile() {
  const url = new URL(`https://graph.instagram.com/v21.0/me`);
  url.searchParams.append("access_token", getAccessToken() || "");
  url.searchParams.append("fields", "id,username,name");

  const response = await fetch(url.toString());
  const data = await response.json();

  if (data.error) {
    console.error(`Instagram API Error:`, data.error);
    return null;
  }

  return data;
}
