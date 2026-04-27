import { getAllConfigs } from "./configManager";

const GRAPH_API_VERSION = process.env.INSTAGRAM_GRAPH_API_VERSION || "v24.0";
const GRAPH_API_URL = "https://graph.instagram.com";

/**
 * Get the current active Instagram access token
 */
async function getAccessToken() {
  const config = await getAllConfigs();
  if (config.is_disconnected) return undefined;
  return config.instagram_access_token || process.env.INSTAGRAM_ACCESS_TOKEN;
}

/**
 * Generate the OAuth authorization URL for Instagram Platform API
 */
export function getAuthUrl(state: string): string {
  const appId = process.env.INSTAGRAM_APP_ID;
  const redirectUri = process.env.INSTAGRAM_REDIRECT_URI;
  
  const params = new URLSearchParams({
    client_id: appId || "",
    redirect_uri: redirectUri || "",
    scope: "instagram_business_basic,instagram_business_content_publish",
    state: state,
    response_type: "code",
  });
  
  return `https://api.instagram.com/oauth/authorize?${params.toString()}`;
}

/**
 * Exchange authorization code for access token
 */
export async function exchangeCodeForToken(code: string) {
  const appId = process.env.INSTAGRAM_APP_ID;
  const appSecret = process.env.INSTAGRAM_APP_SECRET;
  const redirectUri = process.env.INSTAGRAM_REDIRECT_URI;

  const response = await fetch("https://api.instagram.com/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: appId || "",
      client_secret: appSecret || "",
      grant_type: "authorization_code",
      redirect_uri: redirectUri || "",
      code: code,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("Token Exchange Error:", error);
    throw new Error(error.error_message || "Failed to exchange code for token");
  }

  const data = await response.json();

  // Exchange short-lived token for long-lived token
  if (data.access_token) {
    const longLivedData = await getLongLivedToken(data.access_token);
    return { ...data, ...longLivedData };
  }

  return data;
}

/**
 * Exchange short-lived token for long-lived token (60 days)
 */
export async function getLongLivedToken(shortToken: string) {
  const appSecret = process.env.INSTAGRAM_APP_SECRET;
  
  const response = await fetch(
    `${GRAPH_API_URL}/access_token?grant_type=ig_exchange_token&client_secret=${appSecret}&access_token=${shortToken}`
  );
  
  if (!response.ok) {
    console.error("Long Lived Token Error:", await response.json());
    return { access_token: shortToken };
  }
  
  return response.json();
}

/**
 * Get Instagram account info using Instagram Platform API
 */
export async function getAccountProfile(token?: string) {
  const accessToken = token || await getAccessToken();
  if (!accessToken) return null;

  const url = new URL(`${GRAPH_API_URL}/${GRAPH_API_VERSION}/me`);
  url.searchParams.append("access_token", accessToken);
  url.searchParams.append("fields", "id,username,name,profile_picture_url");

  const response = await fetch(url.toString());
  if (!response.ok) {
    console.error("Profile Fetch Error:", await response.json());
    return null;
  }
  
  return response.json();
}

/**
 * Send DM using the Instagram Platform API
 * Note: recipient.comment_id is used for responding to comments
 */
export async function sendDm(commentId: string, message: string) {
  const url = new URL(`${GRAPH_API_URL}/${GRAPH_API_VERSION}/me/messages`);
  const accessToken = await getAccessToken();
  
  if (!accessToken) throw new Error("No access token available");

  const payload = {
    recipient: { comment_id: commentId },
    message: { text: message }
  };

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  if (data.error) console.error("Instagram DM Error:", data.error);
  return data;
}

/**
 * Reply to a comment
 */
export async function replyToComment(commentId: string, message: string) {
  const url = new URL(`${GRAPH_API_URL}/${GRAPH_API_VERSION}/${commentId}/replies`);
  const accessToken = await getAccessToken();
  
  if (!accessToken) throw new Error("No access token available");

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`
    },
    body: JSON.stringify({ message })
  });

  const data = await response.json();
  if (data.error) console.error("Instagram Reply Error:", data.error);
  return data;
}

/**
 * Get account media
 */
export async function getAccountMedia() {
  const accessToken = await getAccessToken();
  if (!accessToken) return [];

  const url = new URL(`${GRAPH_API_URL}/${GRAPH_API_VERSION}/me/media`);
  url.searchParams.append("access_token", accessToken);
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

/**
 * Publish a post to Instagram
 */
export async function publishPost(imageUrl: string, caption: string) {
  const accessToken = await getAccessToken();
  if (!accessToken) throw new Error("No access token available");

  // 1. Create media container
  const containerRes = await fetch(`${GRAPH_API_URL}/${GRAPH_API_VERSION}/me/media`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      image_url: imageUrl,
      caption: caption,
      access_token: accessToken
    })
  });
  
  const containerData = await containerRes.json();
  if (!containerData.id) {
    throw new Error(`Failed to create media container: ${JSON.stringify(containerData.error)}`);
  }

  // 2. Wait for processing (usually 5-10 seconds)
  // In a real app, you'd poll the status, but for simplicity:
  await new Promise(resolve => setTimeout(resolve, 10000));

  // 3. Publish the container
  const publishRes = await fetch(`${GRAPH_API_URL}/${GRAPH_API_VERSION}/me/media_publish`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      creation_id: containerData.id,
      access_token: accessToken
    })
  });

  return publishRes.json();
}

