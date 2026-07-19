import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useSettings } from "@shared/hooks/useSettings";
import Card from "@/components/shared/Card";
//Color presets
const ACCENT_PRESETS = ["#378ADD", "#7C5CFC", "#EF9F27", "#E15A5A", "#EC4899"];
export default function SettingsPage() {
    const { settings, updateSettings } = useSettings();
    const [activities, setActivities] = useState([]);
    const [presets, setPresets] = useState([]);
    const [editingActivityId, setEditingActivityId] = useState(null);
    const [editingPresetId, setEditingPresetId] = useState(null);
    const [notificationsOn, setNotificationsOn] = useState(true);
    const [startOnBootOn, setStartOnBootOn] = useState(false);
    const [darkMode, setDarkMode] = useState(true);
    function loadActivities() {
        window.electronAPI.getActivities().then(setActivities);
    }
    function loadPresets() {
        window.electronAPI.getPresets().then(setPresets);
    }
    useEffect(() => {
        loadActivities();
        loadPresets();
    }, []);
    useEffect(() => {
        setNotificationsOn(!!settings.notifications_enabled);
        setStartOnBootOn(!!settings.launch_on_startup);
    }, [settings]);
    return (_jsxs("div", { className: "flex flex-col gap-6 max-w-2xl mx-auto w-full", children: [_jsxs(Card, { className: "p-4", children: [_jsx("p", { className: "text-xs text-neutral-400 uppercase tracking-wide mb-2.5", children: "Accent color" }), _jsxs("div", { className: "flex gap-2.5 items-center", children: [ACCENT_PRESETS.map((color) => (_jsx("button", { onClick: () => updateSettings({ accent_color: color }), style: { background: color }, className: `w-7 h-7 rounded-full ${settings.accent_color === color
                                    ? "ring-2 ring-white ring-offset-2 ring-offset-neutral-900"
                                    : ""}` }, color))), _jsx("div", { className: `w-7 h-7 rounded-full p-px ${!ACCENT_PRESETS.includes(settings.accent_color)
                                    ? "ring-2 ring-white ring-offset-2 ring-offset-neutral-900"
                                    : "border border-dashed border-neutral-500"}`, children: _jsx("input", { type: "color", value: settings.accent_color, onChange: (e) => updateSettings({ accent_color: e.target.value }), className: "circle-swatch w-full h-full", title: "Custom color" }) })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs(Card, { className: "p-4", children: [_jsxs("div", { className: "flex justify-between items-center mb-2.5", children: [_jsx("p", { className: "text-xs text-neutral-400 uppercase tracking-wide", children: "Timer presets" }), _jsxs("button", { onClick: async () => {
                                            await window.electronAPI.addPreset(15);
                                            loadPresets();
                                        }, className: "text-xs flex items-center gap-1 px-2.5 py-1 bg-neutral-700/60 rounded-md text-white hover:bg-neutral-700", children: [_jsx(Plus, { size: 13 }), " Add"] })] }), _jsx("div", { className: "flex flex-col gap-1.5", children: presets.map((p) => (_jsx(PresetRow, { preset: p, isEditing: editingPresetId === p.id, onEdit: () => setEditingPresetId(p.id), onCancel: () => setEditingPresetId(null), onSave: async (minutes) => {
                                        await window.electronAPI.updatePreset({ id: p.id, minutes });
                                        setEditingPresetId(null);
                                        loadPresets();
                                    }, onDelete: async () => {
                                        await window.electronAPI.deletePreset(p.id);
                                        loadPresets();
                                    } }, p.id))) })] }), _jsxs(Card, { className: "p-4", children: [_jsxs("div", { className: "flex justify-between items-center mb-2.5", children: [_jsx("p", { className: "text-xs text-neutral-400 uppercase tracking-wide", children: "Session presets" }), _jsxs("button", { onClick: async () => {
                                            await window.electronAPI.addActivity({
                                                name: "New activity",
                                                color: ACCENT_PRESETS[0],
                                            });
                                            loadActivities();
                                        }, className: "text-xs flex items-center gap-1 px-2.5 py-1 bg-neutral-700/60 rounded-md text-white hover:bg-neutral-700", children: [_jsx(Plus, { size: 13 }), " Add"] })] }), _jsx("div", { className: "flex flex-col gap-1.5", children: activities.map((a) => (_jsx(ActivityRow, { activity: a, isEditing: editingActivityId === a.id, onEdit: () => setEditingActivityId(a.id), onCancel: () => setEditingActivityId(null), onSave: async (name, color) => {
                                        await window.electronAPI.updateActivity({
                                            id: a.id,
                                            name,
                                            color,
                                        });
                                        setEditingActivityId(null);
                                        loadActivities();
                                    }, onDelete: async () => {
                                        await window.electronAPI.deleteActivity(a.id);
                                        loadActivities();
                                    } }, a.id))) })] })] }), _jsxs(Card, { className: "p-4 max-w-sm", children: [_jsx("p", { className: "text-xs text-neutral-400 uppercase tracking-wide mb-3", children: "Preferences" }), _jsxs("div", { className: "flex flex-col gap-3", children: [_jsx(Toggle, { label: "Notifications", isOn: notificationsOn, onToggle: async () => {
                                    const next = !notificationsOn;
                                    setNotificationsOn(next);
                                    await updateSettings({ notifications_enabled: next ? 1 : 0 });
                                } }), _jsx(Toggle, { label: "Start on boot", isOn: startOnBootOn, onToggle: async () => {
                                    const next = !startOnBootOn;
                                    setStartOnBootOn(next);
                                    await updateSettings({ launch_on_startup: next ? 1 : 0 });
                                } }), _jsx(Toggle, { label: "Dark Mode", isOn: darkMode, onToggle: () => setDarkMode((v) => !v) })] })] })] }));
}
function Toggle({ label, isOn, onToggle, }) {
    return (_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm text-neutral-200", children: label }), _jsx("button", { onClick: onToggle, className: `w-11 h-6 rounded-full relative transition-colors ${isOn ? "bg-blue-600" : "bg-neutral-700"}`, children: _jsx("span", { className: `absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${isOn ? "translate-x-5" : "translate-x-0"}` }) })] }));
}
// PresetRow and ActivityRow — unchanged, keep exactly as they were
function PresetRow({ preset, isEditing, onEdit, onCancel, onSave, onDelete, }) {
    const [minutes, setMinutes] = useState(preset.minutes);
    if (isEditing) {
        return (_jsxs("div", { className: "flex items-center gap-2 bg-neutral-800 rounded-lg px-3 py-2", children: [_jsx("input", { type: "number", min: 1, value: minutes, onChange: (e) => setMinutes(Number(e.target.value)), className: "w-16 bg-neutral-900 text-white text-sm rounded px-2 py-1 border border-neutral-700", autoFocus: true }), _jsx("span", { className: "text-sm text-neutral-400", children: "min" }), _jsxs("div", { className: "ml-auto flex gap-2 text-xs", children: [_jsx("button", { onClick: onCancel, className: "text-neutral-400 hover:text-white", children: "Cancel" }), _jsx("button", { onClick: () => onSave(minutes), className: "text-blue-400 hover:text-blue-300", children: "Save" })] })] }));
    }
    return (_jsxs("div", { className: "flex justify-between items-center bg-neutral-800 rounded-lg px-3 py-2 text-sm", children: [_jsxs("span", { children: [preset.minutes, " min"] }), _jsxs("span", { className: "flex gap-2.5 text-neutral-400", children: [_jsx("button", { onClick: onEdit, className: "hover:text-white", children: _jsx(Pencil, { size: 14 }) }), _jsx("button", { onClick: onDelete, className: "hover:text-white", children: _jsx(Trash2, { size: 14 }) })] })] }));
}
function ActivityRow({ activity, isEditing, onEdit, onCancel, onSave, onDelete, }) {
    const [name, setName] = useState(activity.name);
    const [color, setColor] = useState(activity.color);
    if (isEditing) {
        return (_jsxs("div", { className: "flex items-center gap-2 bg-neutral-800 rounded-lg px-3 py-2", children: [_jsx("input", { type: "text", value: name, onChange: (e) => setName(e.target.value), className: "flex-1 bg-neutral-900 text-white text-sm rounded px-2 py-1 border border-neutral-700", autoFocus: true }), _jsx("input", { type: "color", value: color, onChange: (e) => setColor(e.target.value), className: "w-7 h-7 rounded cursor-pointer bg-transparent border-none" }), _jsxs("div", { className: "flex gap-2 text-xs", children: [_jsx("button", { onClick: onCancel, className: "text-neutral-400 hover:text-white", children: "Cancel" }), _jsx("button", { onClick: () => onSave(name, color), className: "text-blue-400 hover:text-blue-300", children: "Save" })] })] }));
    }
    return (_jsxs("div", { className: "flex justify-between items-center bg-neutral-800 rounded-lg px-3 py-2 text-sm", children: [_jsxs("span", { className: "flex items-center gap-2", children: [_jsx("span", { className: "w-2 h-2 rounded-full", style: { background: activity.color } }), activity.name] }), _jsxs("span", { className: "flex gap-2.5 text-neutral-400", children: [_jsx("button", { onClick: onEdit, className: "hover:text-white", children: _jsx(Pencil, { size: 14 }) }), _jsx("button", { onClick: onDelete, className: "hover:text-white", children: _jsx(Trash2, { size: 14 }) })] })] }));
}
