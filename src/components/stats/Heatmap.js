import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { mixColors } from "@shared/lib/color";
const EMPTY_COLOR = "#27272a";
const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];
const INTENSITY_LEVELS = [0.25, 0.5, 0.75, 1];
const formatFocusTime = (seconds) => {
    if (seconds === 0)
        return "No focus time";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours === 0)
        return `${minutes} min`;
    if (minutes === 0)
        return `${hours}h`;
    return `${hours}h ${minutes}m`;
};
const formatDate = (dateString) => {
    return new Date(`${dateString}T00:00:00`).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};
const getIntensity = (seconds) => {
    if (seconds === 0)
        return 0;
    const minutes = seconds / 60;
    if (minutes < 30)
        return 0.25;
    if (minutes < 60)
        return 0.5;
    if (minutes < 120)
        return 0.75;
    return 1;
};
export default function Heatmap({ days, accentColor }) {
    if (days.length === 0)
        return null;
    /*
     * Convert dates into a lookup map.
     *
     * {
     *   "2026-07-17": 3600,
     *   "2026-07-18": 7200
     * }
     */
    const totalsByDate = new Map(days.map((day) => [day.date, day.totalSeconds]));
    /*
     * Find date range.
     *
     * We align the beginning to Sunday and
     * the end to Saturday so every column
     * represents exactly one calendar week.
     */
    const firstDate = new Date(`${days[0].date}T00:00:00`);
    const lastDate = new Date(`${days[days.length - 1].date}T00:00:00`);
    const startDate = new Date(firstDate);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    const endDate = new Date(lastDate);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
    const weeks = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        const week = [];
        for (let i = 0; i < 7; i++) {
            const date = currentDate.toISOString().split("T")[0];
            week.push({
                date,
                totalSeconds: totalsByDate.get(date) ?? 0,
            });
            currentDate.setDate(currentDate.getDate() + 1);
        }
        weeks.push(week);
    }
    /*
     * Determine which month label appears
     * above each week.
     */
    const monthLabels = weeks.map((week, index) => {
        const firstDay = new Date(`${week[0].date}T00:00:00`);
        const previousWeek = index > 0 ? new Date(`${weeks[index - 1][0].date}T00:00:00`) : null;
        if (index === 0 || firstDay.getMonth() !== previousWeek?.getMonth()) {
            return firstDay.toLocaleDateString("en-US", {
                month: "short",
            });
        }
        return "";
    });
    return (_jsxs("div", { className: "w-full", children: [_jsx("div", { className: "flex ml-8 mb-1", children: monthLabels.map((month, index) => (_jsx("div", { className: "w-[12px] mr-[3px] text-[10px] text-neutral-500", children: month }, index))) }), _jsxs("div", { className: "flex", children: [_jsx("div", { className: "flex flex-col gap-[3px] mr-2", children: DAY_LABELS.map((label, index) => (_jsx("div", { className: "h-[12px] text-[9px] leading-[12px] text-neutral-500", children: label }, index))) }), _jsx("div", { className: "flex gap-[3px] overflow-visible", children: weeks.map((week, weekIndex) => (_jsx("div", { className: "flex flex-col gap-[3px]", children: week.map((day) => {
                                const intensity = getIntensity(day.totalSeconds);
                                const color = intensity === 0
                                    ? EMPTY_COLOR
                                    : mixColors(EMPTY_COLOR, accentColor, intensity);
                                return (_jsx("div", { title: `${formatFocusTime(day.totalSeconds)} on ${formatDate(day.date)}`, className: "\r\n                      w-3\r\n                      h-3\r\n                      rounded-[2px]\r\n                      transition-transform\r\n                      duration-150\r\n                      hover:scale-125\r\n                      hover:z-10\r\n                      cursor-default\r\n                    ", style: {
                                        backgroundColor: color,
                                    } }, day.date));
                            }) }, weekIndex))) })] }), _jsxs("div", { className: "flex justify-end items-center gap-1 mt-2", children: [_jsx("span", { className: "text-[10px] text-neutral-500 mr-1", children: "Less" }), _jsx("span", { className: "w-3 h-3 rounded-[2px]", style: { backgroundColor: EMPTY_COLOR } }), INTENSITY_LEVELS.map((intensity) => (_jsx("span", { className: "w-3 h-3 rounded-[2px]", style: {
                            backgroundColor: mixColors(EMPTY_COLOR, accentColor, intensity),
                        } }, intensity))), _jsx("span", { className: "text-[10px] text-neutral-500 ml-1", children: "More" })] })] }));
}
