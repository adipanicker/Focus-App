// IPC bridge — will fill in with contextBridge.exposeInMainWorld once TimerService is wired up
import { contextBridge, ipcRenderer } from "electron";
import { IPC, TimerState } from "../shared/types";

console.log("[preload] loaded successfully");

contextBridge.exposeInMainWorld("electronAPI", {
  showPip: () => ipcRenderer.send(IPC.SHOW_PIP),
  showMain: () => ipcRenderer.send(IPC.SHOW_MAIN),

  startTimer: (durationSeconds?: number) =>
    ipcRenderer.send(IPC.TIMER_START, durationSeconds),
  pauseTimer: () => ipcRenderer.send(IPC.TIMER_PAUSE),
  resumeTimer: () => ipcRenderer.send(IPC.TIMER_RESUME),
  stopTimer: () => ipcRenderer.send(IPC.TIMER_STOP),
  getTimerState: (): Promise<TimerState> =>
    ipcRenderer.invoke(IPC.TIMER_GET_STATE),
  onTimerTick: (callback: (state: TimerState) => void) => {
    const listener = (_event: unknown, state: TimerState) => callback(state);
    ipcRenderer.on(IPC.TIMER_TICK, listener);
    return () => ipcRenderer.removeListener(IPC.TIMER_TICK, listener);
  },
});
