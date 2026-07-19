import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Flame, Clock4, Sigma } from "lucide-react";
import { useSettings } from "@shared/hooks/useSettings";
import { formatDurationLong, formatClockTime } from "@shared/lib/format";
import Heatmap from "@/components/stats/Heatmap";
import Card from "@/components/shared/Card";
export default function StatsPage() {
    const { settings } = useSettings();
    const [stats, setStats] = useState(null);
    useEffect(() => {
        window.electronAPI.getStatsSummary().then(setStats);
    }, []);
    if (!stats) {
        return _jsx("div", { className: "text-neutral-400 text-sm", children: "Loading stats..." });
    }
    const maxActivitySeconds = Math.max(...stats.byActivity.map((a) => a.totalSeconds), 1);
    return (_jsxs("div", { className: "flex flex-col gap-6 max-w-2xl mx-auto w-full", children: [_jsxs("div", { className: "flex gap-3", children: [_jsx(StatCard, { icon: _jsx(Flame, { size: 13 }), label: "Streak", value: `${stats.streakDays}`, unit: "days" }), _jsx(StatCard, { icon: _jsx(Clock4, { size: 13 }), label: "Today", value: formatDurationLong(stats.todaySeconds) }), _jsx(StatCard, { icon: _jsx(Sigma, { size: 13 }), label: "Total", value: formatDurationLong(stats.totalSeconds) })] }), _jsxs(Card, { className: "p-4", children: [_jsxs("div", { className: "flex justify-between items-start mb-2.5", children: [_jsx("p", { className: "text-xs text-neutral-400 uppercase tracking-wide", children: "Activity heatmap" }), _jsxs("div", { className: "text-right", children: [_jsx("p", { className: "text-[11px] text-neutral-400", children: "Active days" }), _jsx("p", { className: "text-sm font-medium text-neutral-50", children: stats.activeDays })] })] }), _jsx(Heatmap, { days: stats.heatmap, accentColor: settings.accent_color })] }), _jsxs(Card, { className: "p-4", children: [_jsx("p", { className: "text-xs text-neutral-400 uppercase tracking-wide mb-2.5", children: "Time by activity" }), _jsxs("div", { className: "flex flex-col gap-2", children: [stats.byActivity.length === 0 && (_jsx("p", { className: "text-sm text-neutral-500", children: "No focus sessions logged yet." })), stats.byActivity.map((a) => (_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between text-sm mb-1", children: [_jsxs("span", { className: "flex items-center gap-2 text-neutral-100", children: [_jsx("span", { className: "w-2 h-2 rounded-full", style: { background: a.color } }), a.name] }), _jsx("span", { className: "text-neutral-400", children: formatDurationLong(a.totalSeconds) })] }), _jsx("div", { className: "h-1.5 rounded-full bg-neutral-700/60", children: _jsx("div", { className: "h-full rounded-full", style: {
                                                width: `${(a.totalSeconds / maxActivitySeconds) * 100}%`,
                                                background: a.color,
                                            } }) })] }, a.activityId)))] })] }), _jsxs(Card, { className: "p-4", children: [_jsx("p", { className: "text-xs text-neutral-400 uppercase tracking-wide mb-2.5", children: "Today's sessions" }), _jsxs("div", { className: "flex flex-col gap-2", children: [stats.todaySessions.length === 0 && (_jsx("p", { className: "text-sm text-neutral-500", children: "No sessions yet today." })), stats.todaySessions.map((s) => (_jsxs("div", { className: "flex justify-between text-sm", children: [_jsxs("span", { className: "flex items-center gap-2 text-neutral-100", children: [_jsx("span", { className: "w-2 h-2 rounded-full", style: {
                                                    background: s.type === "break"
                                                        ? "#6b7280"
                                                        : (s.activityColor ?? "#6b7280"),
                                                } }), s.type === "break" ? "Break" : (s.activityName ?? "Unlabeled"), " ", "\u00B7 ", formatClockTime(s.startedAt), " - ", formatClockTime(s.endedAt)] }), _jsx("span", { className: "text-neutral-400", children: formatDurationLong(s.durationSeconds) })] }, s.id)))] })] })] }));
}
function StatCard({ icon, label, value, unit, }) {
    return (_jsxs(Card, { className: "flex-1 p-3", children: [_jsxs("p", { className: "text-[11px] text-neutral-400 flex items-center gap-1 mb-1", children: [icon, " ", label] }), _jsxs("p", { className: "text-xl font-medium text-neutral-50", children: [value, " ", unit && (_jsx("span", { className: "text-xs font-normal text-neutral-400", children: unit }))] })] }));
}
