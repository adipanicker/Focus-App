import { useEffect, useState } from "react";
import type { AppSettings } from "../types";

const DEFAULT_SETTINGS: AppSettings = {
  accent_color: "#378ADD",
  dark_mode: 1,
  notifications_enabled: 1,
  launch_on_startup: 0,
};

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    window.electronAPI.getSettings().then(setSettings);
  }, []);

  async function updateSettings(patch: Partial<AppSettings>) {
    const updated = await window.electronAPI.updateSettings(patch);
    setSettings(updated);
  }

  return { settings, updateSettings };
}
