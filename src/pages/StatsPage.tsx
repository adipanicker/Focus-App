import { useEffect, useState } from "react";
import { Flame, Clock4, Sigma } from "lucide-react";
import { useSettings } from "@shared/hooks/useSettings";
import { formatDurationLong, formatClockTime } from "@shared/lib/format";
import Heatmap from "@/components/stats/Heatmap";
import type { StatsSummary } from "@shared/types";

export default function StatsPage() {
  const { settings } = useSettings();
  const [stats, setStats] = useState<StatsSummary | null>(null);

  useEffect(() => {
    window.electronAPI.getStatsSummary().then(setStats);
  }, []);

  if (!stats) {
    return <div className="text-neutral-400 text-sm">Loading stats...</div>;
  }

  const maxActivitySeconds = Math.max(
    ...stats.byActivity.map((a) => a.totalSeconds),
    1,
  );

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div className="flex gap-3">
        <StatCard
          icon={<Flame size={13} />}
          label="Streak"
          value={`${stats.streakDays}`}
          unit="days"
        />
        <StatCard
          icon={<Clock4 size={13} />}
          label="Today"
          value={formatDurationLong(stats.todaySeconds)}
        />
        <StatCard
          icon={<Sigma size={13} />}
          label="Total"
          value={formatDurationLong(stats.totalSeconds)}
        />
      </div>

      <div>
        <p className="text-xs text-neutral-400 uppercase tracking-wide mb-2.5">
          Activity heatmap
        </p>
        <Heatmap days={stats.heatmap} accentColor={settings.accent_color} />
      </div>

      <div>
        <p className="text-xs text-neutral-400 uppercase tracking-wide mb-2.5">
          Time by activity
        </p>
        <div className="flex flex-col gap-2">
          {stats.byActivity.length === 0 && (
            <p className="text-sm text-neutral-500">
              No focus sessions logged yet.
            </p>
          )}
          {stats.byActivity.map((a) => (
            <div key={a.activityId}>
              <div className="flex justify-between text-sm mb-1">
                <span className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: a.color }}
                  />
                  {a.name}
                </span>
                <span className="text-neutral-400">
                  {formatDurationLong(a.totalSeconds)}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-neutral-800">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(a.totalSeconds / maxActivitySeconds) * 100}%`,
                    background: a.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs text-neutral-400 uppercase tracking-wide mb-2.5">
          Today's sessions
        </p>
        <div className="flex flex-col gap-2">
          {stats.todaySessions.length === 0 && (
            <p className="text-sm text-neutral-500">No sessions yet today.</p>
          )}
          {stats.todaySessions.map((s) => (
            <div key={s.id} className="flex justify-between text-sm">
              <span className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{
                    background:
                      s.type === "break"
                        ? "#6b7280"
                        : (s.activityColor ?? "#6b7280"),
                  }}
                />
                {s.type === "break" ? "Break" : (s.activityName ?? "Unlabeled")}{" "}
                · {formatClockTime(s.startedAt)} - {formatClockTime(s.endedAt)}
              </span>
              <span className="text-neutral-400">
                {formatDurationLong(s.durationSeconds)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  unit,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit?: string;
}) {
  return (
    <div className="flex-1 bg-neutral-800 rounded-xl p-3">
      <p className="text-[11px] text-neutral-400 flex items-center gap-1 mb-1">
        {icon} {label}
      </p>
      <p className="text-xl font-medium">
        {value}{" "}
        {unit && (
          <span className="text-xs font-normal text-neutral-400">{unit}</span>
        )}
      </p>
    </div>
  );
}
