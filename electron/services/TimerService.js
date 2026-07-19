import { Notification } from "electron";
import { IPC } from "../../shared/types";
import { sessionService } from "./SessionService";
import { db } from "./db";
const DEFAULT_DURATION = 25 * 60;
class TimerService {
    status = "idle";
    durationSeconds = DEFAULT_DURATION;
    remainingSeconds = DEFAULT_DURATION;
    intervalId = null;
    windowGetters = [];
    activityId = null;
    sessionType = "focus";
    startedAt = null;
    registerWindow(getWindow) {
        this.windowGetters.push(getWindow);
    }
    getState() {
        return {
            status: this.status,
            remainingSeconds: this.remainingSeconds,
            durationSeconds: this.durationSeconds,
            type: this.sessionType,
        };
    }
    start(durationSeconds = DEFAULT_DURATION, activityId = null, type = "focus") {
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
        if (this.status !== "running")
            return;
        this.status = "paused";
        this.clearTimer();
        this.broadcast();
    }
    resume() {
        if (this.status !== "paused")
            return;
        this.status = "running";
        this.runInterval();
        this.broadcast();
    }
    stop() {
        if (this.status === "idle")
            return;
        this.logCurrentSession(false);
        this.status = "idle";
        this.remainingSeconds = this.durationSeconds;
        this.clearTimer();
        this.broadcast();
    }
    runInterval() {
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
    logCurrentSession(completed) {
        if (this.startedAt === null)
            return; // already logged (e.g. PiP stop after natural completion)
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
    clearTimer() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
    broadcast() {
        const state = this.getState();
        for (const getWindow of this.windowGetters) {
            const win = getWindow();
            if (win && !win.isDestroyed()) {
                win.webContents.send(IPC.TIMER_TICK, state);
            }
        }
    }
    maybeNotifyCompletion() {
        const settings = db
            .prepare("SELECT notifications_enabled FROM settings WHERE id = 1")
            .get();
        if (!settings?.notifications_enabled)
            return;
        new Notification({
            title: this.sessionType === "focus"
                ? "Focus session complete"
                : "Break complete",
            body: this.sessionType === "focus"
                ? "Nice work — take a break?"
                : "Break's over, ready to focus?",
        }).show();
    }
}
export const timerService = new TimerService();
