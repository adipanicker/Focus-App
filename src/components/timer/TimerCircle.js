import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { mixColors } from "@shared/lib/color";
const RADIUS = 95;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const MUTED_COLOR = "#4b5563"; // faded end-state — will come from settings later
function formatTime(totalSeconds) {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
export default function TimerCircle({ remainingSeconds, durationSeconds, accentColor = "#378ADD", }) {
    const elapsedFraction = durationSeconds > 0 ? 1 - remainingSeconds / durationSeconds : 0;
    const dashOffset = CIRCUMFERENCE * elapsedFraction; // ring drains as time passes
    const strokeColor = mixColors(accentColor, MUTED_COLOR, elapsedFraction);
    return (_jsxs("svg", { viewBox: "0 0 220 220", style: { width: "min(55vw, 45vh)", height: "min(55vw, 50vh)" }, children: [_jsx("circle", { cx: 110, cy: 110, r: RADIUS, fill: "none", stroke: "#27272a", strokeWidth: 10 }), _jsx("circle", { cx: 110, cy: 110, r: RADIUS, fill: "none", stroke: strokeColor, strokeWidth: 10, strokeLinecap: "round", strokeDasharray: CIRCUMFERENCE, strokeDashoffset: dashOffset, transform: "rotate(-90 110 110)", style: { transition: "stroke 1s linear" } }), _jsx("text", { x: 110, y: 106, textAnchor: "middle", fontSize: 40, fontWeight: 500, fill: "white", children: formatTime(remainingSeconds) }), _jsxs("text", { x: 110, y: 132, textAnchor: "middle", fontSize: 13, fill: "#9ca3af", children: ["of ", formatTime(durationSeconds)] })] }));
}
