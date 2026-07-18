import type {
  TimerState,
  Activity,
  TimerPreset,
  AppSettings,
  StatsSummary,
} from "./types";

export {};

declare global {
  interface Window {
    electronAPI: {
      showPip: () => void;
      showMain: () => void;
      startTimer: (payload: {
        durationSeconds: number;
        activityId: number | null;
        type?: "focus" | "break";
      }) => void;
      pauseTimer: () => void;
      resumeTimer: () => void;
      stopTimer: () => void;
      getTimerState: () => Promise<TimerState>;
      onTimerTick: (callback: (state: TimerState) => void) => () => void;

      getActivities: () => Promise<Activity[]>;
      addActivity: (payload: {
        name: string;
        color: string;
      }) => Promise<Activity>;
      updateActivity: (payload: {
        id: number;
        name: string;
        color: string;
      }) => Promise<Activity>;
      deleteActivity: (id: number) => Promise<boolean>;

      getPresets: () => Promise<TimerPreset[]>;
      addPreset: (minutes: number) => Promise<TimerPreset>;
      updatePreset: (payload: {
        id: number;
        minutes: number;
      }) => Promise<TimerPreset>;
      deletePreset: (id: number) => Promise<boolean>;

      getSettings: () => Promise<AppSettings>;
      updateSettings: (payload: Partial<AppSettings>) => Promise<AppSettings>;
      getStatsSummary: () => Promise<StatsSummary>;
    };
  }
}
