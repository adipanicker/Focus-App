import { useEffect, useState } from "react";
import type { TimerState } from "../types";

const initialState: TimerState = {
  status: "idle",
  remainingSeconds: 25 * 60,
  durationSeconds: 25 * 60,
};

export function useTimerState() {
  const [state, setState] = useState<TimerState>(initialState);

  useEffect(() => {
    window.electronAPI.getTimerState().then(setState);
    return window.electronAPI.onTimerTick(setState);
  }, []);

  return state;
}
