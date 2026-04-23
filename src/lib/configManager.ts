import { createClient } from './supabase/server';

export type ReelConfig = {
  trigger_keyword: string;
  dm_message: string;
  comment_reply: string;
  active: boolean;
};

export type AppConfig = {
  reels: Record<string, ReelConfig>;
  default: ReelConfig;
  instagram_access_token?: string;
  instagram_business_id?: string;
  instagram_profile?: {
    id: string;
    name?: string;
    username?: string;
    profile_picture_url?: string;
    followers_count?: number;
    biography?: string;
    website?: string;
  } | null;
  is_disconnected?: boolean;
};

export async function getAllConfigs(): Promise<AppConfig> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('app_config')
    .select('*')
    .eq('id', 'main')
    .single();

  if (error || !data) {
    console.error("Error fetching config from Supabase:", error);
    return {
      reels: {},
      default: {
        trigger_keyword: "info",
        dm_message: "Thanks for your interest! Check your DMs.",
        comment_reply: "Sent you a DM!",
        active: true
      }
    };
  }

  // The 'config' column stores { reels, default }
  const jsonConfig = data.config || {};

  return {
    reels: jsonConfig.reels || {},
    default: jsonConfig.default || {
      trigger_keyword: "info",
      dm_message: "Thanks for your interest! Check your DMs.",
      comment_reply: "Sent you a DM!",
      active: true
    },
    instagram_access_token: data.instagram_access_token,
    instagram_business_id: data.instagram_business_id,
    instagram_profile: data.instagram_profile,
    is_disconnected: data.is_disconnected
  };
}

export async function getReelConfig(mediaId: string): Promise<ReelConfig> {
  const config = await getAllConfigs();
  return config.reels[mediaId] || config.default;
}

export async function updateReelConfig(mediaId: string, newConfig: ReelConfig): Promise<ReelConfig> {
  const config = await getAllConfigs();
  const updatedReels = { ...config.reels, [mediaId]: newConfig };
  
  const supabase = await createClient();
  const { error } = await supabase
    .from('app_config')
    .update({ 
      config: { 
        reels: updatedReels, 
        default: config.default 
      },
      updated_at: new Date().toISOString()
    })
    .eq('id', 'main');

  if (error) console.error("Error updating reel config:", error);
  return newConfig;
}

export async function updateAuthConfig(token: string, businessId: string, profile?: object | null) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('app_config')
    .update({
      instagram_access_token: token,
      instagram_business_id: businessId,
      instagram_profile: profile || null,
      is_disconnected: false,
      updated_at: new Date().toISOString()
    })
    .eq('id', 'main');

  if (error) console.error("Error updating auth config:", error);
}

export async function clearAuthConfig() {
  const supabase = await createClient();
  const { error } = await supabase
    .from('app_config')
    .update({
      instagram_access_token: null,
      instagram_business_id: null,
      is_disconnected: true,
      updated_at: new Date().toISOString()
    })
    .eq('id', 'main');

  if (error) console.error("Error clearing auth config:", error);
}
