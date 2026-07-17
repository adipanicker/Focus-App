import type { TimerState } from "./types";

export {};

declare global {
  interface Window {
    electronAPI: {
      showPip: () => void;
      showMain: () => void;
      startTimer: (durationSeconds?: number) => void;
      pauseTimer: () => void;
      resumeTimer: () => void;
      stopTimer: () => void;
      getTimerState: () => Promise<TimerState>;
      onTimerTick: (callback: (state: TimerState) => void) => () => void;
    };
  }
}
