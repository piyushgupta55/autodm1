import fs from 'fs';
import path from 'path';

const CONFIG_FILE = path.join(process.cwd(), 'reels_config.json');

export type ReelConfig = {
  trigger_keyword: string;
  dm_message: string;
  comment_reply: string;
  active: boolean;
};

export type AppConfig = {
  reels: Record<string, ReelConfig>;
  default: ReelConfig;
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
    saveConfig(DEFAULT_CONFIG);
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
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
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
