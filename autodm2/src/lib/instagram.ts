const GRAPH_API_URL = "https://graph.instagram.com";

function getAccessToken() {
  return process.env.INSTAGRAM_ACCESS_TOKEN;
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
