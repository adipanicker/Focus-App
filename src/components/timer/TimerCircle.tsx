import { mixColors } from "@shared/lib/color";

interface TimerCircleProps {
  remainingSeconds: number;
  durationSeconds: number;
  accentColor?: string;
}

const RADIUS = 95;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const MUTED_COLOR = "#4b5563"; // faded end-state — will come from settings later

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function TimerCircle({
  remainingSeconds,
  durationSeconds,
  accentColor = "#378ADD",
}: TimerCircleProps) {
  const elapsedFraction =
    durationSeconds > 0 ? 1 - remainingSeconds / durationSeconds : 0;
  const dashOffset = CIRCUMFERENCE * elapsedFraction; // ring drains as time passes
  const strokeColor = mixColors(accentColor, MUTED_COLOR, elapsedFraction);

  return (
    <svg
      viewBox="0 0 220 220"
      style={{ width: "min(55vw, 45vh)", height: "min(55vw, 50vh)" }}
    >
      <circle
        cx={110}
        cy={110}
        r={RADIUS}
        fill="none"
        stroke="#27272a"
        strokeWidth={10}
      />
      <circle
        cx={110}
        cy={110}
        r={RADIUS}
        fill="none"
        stroke={strokeColor}
        strokeWidth={10}
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={dashOffset}
        transform="rotate(-90 110 110)"
        style={{ transition: "stroke 1s linear" }}
      />
      <text
        x={110}
        y={106}
        textAnchor="middle"
        fontSize={40}
        fontWeight={500}
        fill="white"
      >
        {formatTime(remainingSeconds)}
      </text>
      <text x={110} y={132} textAnchor="middle" fontSize={13} fill="#9ca3af">
        of {formatTime(durationSeconds)}
      </text>
    </svg>
  );
}
