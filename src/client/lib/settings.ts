import config from "../../../config.sample.json";

type ServerConfig = typeof config;

interface ClientSettings extends ServerConfig {
  radarr: ServerConfig["radarr"] & { real_base_url: string };
  sonarr: ServerConfig["sonarr"] & { real_base_url: string };
}

let settingsStore: ClientSettings | null = null;

export async function fetchSettings() {
  const response = await fetch("/api/settings");
  settingsStore = await response.json();
}

export default function getSettings() {
  if (!settingsStore) {
    throw new Error("Settings not loaded");
  }

  return settingsStore;
}
