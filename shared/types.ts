export const IPC = {
  SHOW_PIP: "window:show-pip",
  SHOW_MAIN: "window:show-main",
  TIMER_START: "timer:start",
  TIMER_PAUSE: "timer:pause",
  TIMER_RESUME: "timer:resume",
  TIMER_STOP: "timer:stop",
  TIMER_TICK: "timer:tick",
  TIMER_GET_STATE: "timer:get-state",
} as const;

export type TimerStatus = "idle" | "running" | "paused" | "completed";

export interface TimerState {
  status: TimerStatus;
  remainingSeconds: number;
  durationSeconds: number;
}
