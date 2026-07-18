import { contextBridge, ipcRenderer } from "electron";
import {
  IPC,
  TimerState,
  Activity,
  TimerPreset,
  AppSettings,
  StatsSummary,
} from "../shared/types";

contextBridge.exposeInMainWorld("electronAPI", {
  showPip: () => ipcRenderer.send(IPC.SHOW_PIP),
  showMain: () => ipcRenderer.send(IPC.SHOW_MAIN),

  startTimer: (payload: {
    durationSeconds: number;
    activityId: number | null;
    type?: "focus" | "break";
  }) => ipcRenderer.send(IPC.TIMER_START, payload),
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

  getActivities: (): Promise<Activity[]> =>
    ipcRenderer.invoke(IPC.ACTIVITIES_GET_ALL),
  addActivity: (payload: { name: string; color: string }): Promise<Activity> =>
    ipcRenderer.invoke(IPC.ACTIVITIES_ADD, payload),
  updateActivity: (payload: {
    id: number;
    name: string;
    color: string;
  }): Promise<Activity> => ipcRenderer.invoke(IPC.ACTIVITIES_UPDATE, payload),
  deleteActivity: (id: number): Promise<boolean> =>
    ipcRenderer.invoke(IPC.ACTIVITIES_DELETE, id),

  getPresets: (): Promise<TimerPreset[]> =>
    ipcRenderer.invoke(IPC.PRESETS_GET_ALL),
  addPreset: (minutes: number): Promise<TimerPreset> =>
    ipcRenderer.invoke(IPC.PRESETS_ADD, { minutes }),
  updatePreset: (payload: {
    id: number;
    minutes: number;
  }): Promise<TimerPreset> => ipcRenderer.invoke(IPC.PRESETS_UPDATE, payload),
  deletePreset: (id: number): Promise<boolean> =>
    ipcRenderer.invoke(IPC.PRESETS_DELETE, id),

  getSettings: (): Promise<AppSettings> => ipcRenderer.invoke(IPC.SETTINGS_GET),
  updateSettings: (payload: Partial<AppSettings>): Promise<AppSettings> =>
    ipcRenderer.invoke(IPC.SETTINGS_UPDATE, payload),

  getStatsSummary: (): Promise<StatsSummary> =>
    ipcRenderer.invoke(IPC.STATS_GET_SUMMARY),
});
