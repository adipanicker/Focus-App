import { mixColors } from "@shared/lib/color";
import type { DayTotal } from "@shared/types";

interface HeatmapProps {
  days: DayTotal[];
  accentColor: string;
}

const EMPTY_COLOR = "#27272a";

export default function Heatmap({ days, accentColor }: HeatmapProps) {
  const maxSeconds = Math.max(...days.map((d) => d.totalSeconds), 1);
  const weeks: DayTotal[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div>
      <div className="flex gap-0.75">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-0.75">
            {week.map((day) => {
              const intensity = day.totalSeconds / maxSeconds;
              const color =
                day.totalSeconds > 0
                  ? mixColors(EMPTY_COLOR, accentColor, intensity)
                  : EMPTY_COLOR;
              return (
                <div
                  key={day.date}
                  title={`${day.date}: ${Math.round(day.totalSeconds / 60)} min`}
                  className="w-2.25 h-2.25 rounded-sm"
                  style={{ background: color }}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex justify-end items-center gap-1 mt-1.5">
        <span className="text-[10px] text-neutral-500">Less</span>
        {[0, 0.33, 0.66, 1].map((t) => (
          <span
            key={t}
            className="w-2 h-2 rounded-sm"
            style={{
              background:
                t === 0 ? EMPTY_COLOR : mixColors(EMPTY_COLOR, accentColor, t),
            }}
          />
        ))}
        <span className="text-[10px] text-neutral-500">More</span>
      </div>
    </div>
  );
}
