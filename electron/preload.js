import { contextBridge, ipcRenderer } from "electron";
import { IPC, } from "../shared/types";
contextBridge.exposeInMainWorld("electronAPI", {
    showPip: () => ipcRenderer.send(IPC.SHOW_PIP),
    showMain: () => ipcRenderer.send(IPC.SHOW_MAIN),
    startTimer: (payload) => ipcRenderer.send(IPC.TIMER_START, payload),
    pauseTimer: () => ipcRenderer.send(IPC.TIMER_PAUSE),
    resumeTimer: () => ipcRenderer.send(IPC.TIMER_RESUME),
    stopTimer: () => ipcRenderer.send(IPC.TIMER_STOP),
    getTimerState: () => ipcRenderer.invoke(IPC.TIMER_GET_STATE),
    onTimerTick: (callback) => {
        const listener = (_event, state) => callback(state);
        ipcRenderer.on(IPC.TIMER_TICK, listener);
        return () => ipcRenderer.removeListener(IPC.TIMER_TICK, listener);
    },
    getActivities: () => ipcRenderer.invoke(IPC.ACTIVITIES_GET_ALL),
    addActivity: (payload) => ipcRenderer.invoke(IPC.ACTIVITIES_ADD, payload),
    updateActivity: (payload) => ipcRenderer.invoke(IPC.ACTIVITIES_UPDATE, payload),
    deleteActivity: (id) => ipcRenderer.invoke(IPC.ACTIVITIES_DELETE, id),
    getPresets: () => ipcRenderer.invoke(IPC.PRESETS_GET_ALL),
    addPreset: (minutes) => ipcRenderer.invoke(IPC.PRESETS_ADD, { minutes }),
    updatePreset: (payload) => ipcRenderer.invoke(IPC.PRESETS_UPDATE, payload),
    deletePreset: (id) => ipcRenderer.invoke(IPC.PRESETS_DELETE, id),
    getSettings: () => ipcRenderer.invoke(IPC.SETTINGS_GET),
    updateSettings: (payload) => ipcRenderer.invoke(IPC.SETTINGS_UPDATE, payload),
    getStatsSummary: () => ipcRenderer.invoke(IPC.STATS_GET_SUMMARY),
});
