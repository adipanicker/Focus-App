import { BrowserWindow } from "electron";
import { IPC, TimerState, TimerStatus } from "../../shared/types";

const DEFAULT_DURATION = 25 * 60;

class TimerService {
  private status: TimerStatus = "idle";
  private durationSeconds = DEFAULT_DURATION;
  private remainingSeconds = DEFAULT_DURATION;
  private intervalId: NodeJS.Timeout | null = null;
  private windowGetters: (() => BrowserWindow | null)[] = [];

  registerWindow(getWindow: () => BrowserWindow | null) {
    this.windowGetters.push(getWindow);
  }

  getState(): TimerState {
    return {
      status: this.status,
      remainingSeconds: this.remainingSeconds,
      durationSeconds: this.durationSeconds,
    };
  }

  start(durationSeconds: number = DEFAULT_DURATION) {
    this.durationSeconds = durationSeconds;
    this.remainingSeconds = this.remainingSeconds;
    this.status = "running";
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
      }
      this.broadcast();
    }, 1000);
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
}

export const timerService = new TimerService();
