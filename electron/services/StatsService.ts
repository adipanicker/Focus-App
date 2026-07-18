import { db } from "./db";
import type {
  StatsSummary,
  DayTotal,
  ActivityBreakdown,
  TodaySession,
} from "../../shared/types";

const HEATMAP_DAYS = 182;
const DAY_MS = 86400000;

function localDateKey(timestampMs: number) {
  const d = new Date(timestampMs);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

class StatsService {
  getSummary(): StatsSummary {
    const now = Date.now();
    const todayKey = localDateKey(now);

    const rows = db
      .prepare(
        `SELECT started_at, duration_seconds FROM sessions WHERE type = 'focus'`,
      )
      .all() as { started_at: number; duration_seconds: number }[];

    const dailyTotals = new Map<string, number>();
    for (const row of rows) {
      const key = localDateKey(row.started_at);
      dailyTotals.set(key, (dailyTotals.get(key) ?? 0) + row.duration_seconds);
    }

    const heatmap: DayTotal[] = [];
    for (let i = HEATMAP_DAYS - 1; i >= 0; i--) {
      const key = localDateKey(now - i * DAY_MS);
      heatmap.push({ date: key, totalSeconds: dailyTotals.get(key) ?? 0 });
    }

    let streakDays = 0;
    let cursorMs = now;
    if ((dailyTotals.get(todayKey) ?? 0) === 0) {
      cursorMs -= DAY_MS; // don't break the streak just because today hasn't happened yet
    }
    while ((dailyTotals.get(localDateKey(cursorMs)) ?? 0) > 0) {
      streakDays++;
      cursorMs -= DAY_MS;
    }

    const todaySeconds = dailyTotals.get(todayKey) ?? 0;
    const totalSeconds = rows.reduce((sum, r) => sum + r.duration_seconds, 0);

    const byActivity = db
      .prepare(
        `
        SELECT a.id as activityId, a.name, a.color, SUM(s.duration_seconds) as totalSeconds
        FROM sessions s
        JOIN activities a ON a.id = s.activity_id
        WHERE s.type = 'focus'
        GROUP BY a.id
        ORDER BY totalSeconds DESC
      `,
      )
      .all() as ActivityBreakdown[];

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const todaySessions = db
      .prepare(
        `
        SELECT s.id, a.name as activityName, a.color as activityColor, s.type,
               s.started_at as startedAt, s.ended_at as endedAt, s.duration_seconds as durationSeconds
        FROM sessions s
        LEFT JOIN activities a ON a.id = s.activity_id
        WHERE s.started_at >= ?
        ORDER BY s.started_at ASC
      `,
      )
      .all(startOfToday.getTime()) as TodaySession[];

    return {
      streakDays,
      todaySeconds,
      totalSeconds,
      activeDays: dailyTotals.size,
      heatmap,
      byActivity,
      todaySessions,
    };
  }
}

export const statsService = new StatsService();
