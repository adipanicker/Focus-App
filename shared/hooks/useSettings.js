import { useEffect, useState } from "react";
const DEFAULT_SETTINGS = {
    accent_color: "#378ADD",
    dark_mode: 1,
    notifications_enabled: 1,
    launch_on_startup: 0,
    last_activity_id: null,
    last_duration_minutes: 25,
};
export function useSettings() {
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        window.electronAPI.getSettings().then((s) => {
            setSettings(s);
            setLoaded(true);
        });
    }, []);
    async function updateSettings(patch) {
        const updated = await window.electronAPI.updateSettings(patch);
        setSettings(updated);
    }
    return { settings, loaded, updateSettings };
}
