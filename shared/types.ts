export const IPC = {
  SHOW_PIP: "window:show-pip",
  SHOW_MAIN: "window:show-main",
  TIMER_START: "timer:start",
  TIMER_PAUSE: "timer:pause",
  TIMER_RESUME: "timer:resume",
  TIMER_STOP: "timer:stop",
  TIMER_TICK: "timer:tick",
  TIMER_GET_STATE: "timer:get-state",
  ACTIVITIES_GET_ALL: "activities:get-all",
  ACTIVITIES_ADD: "activities:add",
  ACTIVITIES_UPDATE: "activities:update",
  ACTIVITIES_DELETE: "activities:delete",
  PRESETS_GET_ALL: "presets:get-all",
  PRESETS_ADD: "presets:add",
  PRESETS_UPDATE: "presets:update",
  PRESETS_DELETE: "presets:delete",
  SETTINGS_GET: "settings:get",
  SETTINGS_UPDATE: "settings:update",
  STATS_GET_SUMMARY: "stats:get-summary",
} as const;

export type TimerStatus = "idle" | "running" | "paused" | "completed";

export interface TimerState {
  status: TimerStatus;
  remainingSeconds: number;
  durationSeconds: number;
  type: "focus" | "break";
}

export interface Activity {
  id: number;
  name: string;
  color: string;
  created_at: number;
}

export interface TimerPreset {
  id: number;
  minutes: number;
  created_at: number;
}

export interface Session {
  id: number;
  activity_id: number | null;
  type: "focus" | "break";
  planned_duration_seconds: number;
  duration_seconds: number;
  started_at: number;
  ended_at: number;
  completed: number; // 0 or 1 — SQLite has no real boolean
}

export interface AppSettings {
  accent_color: string;
  dark_mode: number;
  notifications_enabled: number;
  launch_on_startup: number;
}

export interface DayTotal {
  date: string; // YYYY-MM-DD, local time
  totalSeconds: number;
}

export interface ActivityBreakdown {
  activityId: number;
  name: string;
  color: string;
  totalSeconds: number;
}

export interface TodaySession {
  id: number;
  activityName: string | null;
  activityColor: string | null;
  type: "focus" | "break";
  startedAt: number;
  endedAt: number;
  durationSeconds: number;
}

export interface StatsSummary {
  streakDays: number;
  todaySeconds: number;
  totalSeconds: number;
  activeDays: number;
  heatmap: DayTotal[];
  byActivity: ActivityBreakdown[];
  todaySessions: TodaySession[];
}
