import { useEffect, useState } from "react";
const initialState = {
    status: "idle",
    remainingSeconds: 25 * 60,
    durationSeconds: 25 * 60,
    type: "focus",
};
export function useTimerState() {
    const [state, setState] = useState(initialState);
    useEffect(() => {
        window.electronAPI.getTimerState().then(setState);
        return window.electronAPI.onTimerTick(setState);
    }, []);
    return state;
}
