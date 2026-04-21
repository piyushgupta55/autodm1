import fs from 'fs';
import path from 'path';

const CONFIG_FILE = path.join('/tmp', 'reels_config.json');

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
  is_disconnected?: boolean;
};

const DEFAULT_CONFIG: AppConfig = {
  reels: {},
  default: {
    trigger_keyword: "info",
    dm_message: "Thanks for your interest! Check your DMs.",
    comment_reply: "Sent you a DM!",
    active: true
  }
};

function loadConfig(): AppConfig {
  if (!fs.existsSync(CONFIG_FILE)) {
    try {
      saveConfig(DEFAULT_CONFIG);
    } catch (e) {
      console.warn("Could not write initial config (read-only filesystem?)", e);
    }
    return DEFAULT_CONFIG;
  }
  try {
    const data = fs.readFileSync(CONFIG_FILE, 'utf-8');
    return JSON.parse(data) as AppConfig;
  } catch (e) {
    console.error("Error reading config", e);
    return DEFAULT_CONFIG;
  }
}

function saveConfig(config: AppConfig) {
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
  } catch (e) {
    console.warn("Failed to save config, running in read-only environment?", e);
  }
}

export function getAllConfigs(): AppConfig {
  return loadConfig();
}

export function getReelConfig(mediaId: string): ReelConfig {
  const config = loadConfig();
  return config.reels[mediaId] || config.default;
}

export function updateReelConfig(mediaId: string, newConfig: ReelConfig): ReelConfig {
  const config = loadConfig();
  config.reels[mediaId] = newConfig;
  saveConfig(config);
  return newConfig;
}

export function updateAuthConfig(token: string, businessId: string) {
  const config = loadConfig();
  config.instagram_access_token = token;
  config.instagram_business_id = businessId;
  config.is_disconnected = false;
  saveConfig(config);
}

export function clearAuthConfig() {
  const config = loadConfig();
  delete config.instagram_access_token;
  delete config.instagram_business_id;
  config.is_disconnected = true;
  saveConfig(config);
}
