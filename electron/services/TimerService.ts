import { BrowserWindow, Notification } from "electron";
import { IPC, TimerState, TimerStatus } from "../../shared/types";
import { sessionService } from "./SessionService";
import { db } from "./db";

const DEFAULT_DURATION = 25 * 60;

class TimerService {
  private status: TimerStatus = "idle";
  private durationSeconds = DEFAULT_DURATION;
  private remainingSeconds = DEFAULT_DURATION;
  private intervalId: NodeJS.Timeout | null = null;
  private windowGetters: (() => BrowserWindow | null)[] = [];

  private activityId: number | null = null;
  private sessionType: "focus" | "break" = "focus";
  private startedAt: number | null = null;

  registerWindow(getWindow: () => BrowserWindow | null) {
    this.windowGetters.push(getWindow);
  }

  getState(): TimerState {
    return {
      status: this.status,
      remainingSeconds: this.remainingSeconds,
      durationSeconds: this.durationSeconds,
      type: this.sessionType,
    };
  }

  start(
    durationSeconds: number = DEFAULT_DURATION,
    activityId: number | null = null,
    type: "focus" | "break" = "focus",
  ) {
    this.durationSeconds = durationSeconds;
    this.remainingSeconds = durationSeconds;
    this.status = "running";
    this.activityId = activityId;
    this.sessionType = type;
    this.startedAt = Date.now();
    this.runInterval();
    this.broadcast();
  }

  pause() {
    if (this.status !== "running") return;
    this.status = "paused";
    this.clearTimer();
    this.broadcast();
  }

  resume() {
    if (this.status !== "paused") return;
    this.status = "running";
    this.runInterval();
    this.broadcast();
  }

  stop() {
    if (this.status === "idle") return;

    this.logCurrentSession(false);

    this.status = "idle";
    this.remainingSeconds = this.durationSeconds;
    this.clearTimer();
    this.broadcast();
  }

  private runInterval() {
    this.clearTimer();
    this.intervalId = setInterval(() => {
      this.remainingSeconds -= 1;
      if (this.remainingSeconds <= 0) {
        this.remainingSeconds = 0;
        this.status = "completed";
        this.clearTimer();
        this.logCurrentSession(true);
        this.maybeNotifyCompletion();
      }
      this.broadcast();
    }, 1000);
  }

  private logCurrentSession(completed: boolean) {
    if (this.startedAt === null) return; // already logged (e.g. PiP stop after natural completion)

    const elapsedSeconds = this.durationSeconds - this.remainingSeconds;
    if (elapsedSeconds <= 0) {
      this.startedAt = null;
      return; // stopped instantly, nothing worth recording
    }

    sessionService.logSession({
      activityId: this.activityId,
      type: this.sessionType,
      plannedDurationSeconds: this.durationSeconds,
      durationSeconds: elapsedSeconds,
      startedAt: this.startedAt,
      endedAt: Date.now(),
      completed,
    });

    this.startedAt = null;
  }

  private clearTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private broadcast() {
    const state = this.getState();
    for (const getWindow of this.windowGetters) {
      const win = getWindow();
      if (win && !win.isDestroyed()) {
        win.webContents.send(IPC.TIMER_TICK, state);
      }
    }
  }

  private maybeNotifyCompletion() {
    const settings = db
      .prepare("SELECT notifications_enabled FROM settings WHERE id = 1")
      .get() as { notifications_enabled: number } | undefined;
    if (!settings?.notifications_enabled) return;

    new Notification({
      title:
        this.sessionType === "focus"
          ? "Focus session complete"
          : "Break complete",
      body:
        this.sessionType === "focus"
          ? "Nice work — take a break?"
          : "Break's over, ready to focus?",
    }).show();
  }
}

export const timerService = new TimerService();
