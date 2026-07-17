import { useTimerState } from "@shared/hooks/useTimerState";

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function App() {
  const { status, remainingSeconds } = useTimerState();

  return (
    <div style={{ padding: "2rem", color: "black" }}>
      <h1>Focus</h1>
      <p style={{ fontSize: "48px", fontFamily: "monospace" }}>
        {formatTime(remainingSeconds)}
      </p>
      <p style={{ opacity: 0.6 }}>{status}</p>

      <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
        <button onClick={() => window.electronAPI.startTimer(25 * 60)}>
          Start 25m
        </button>
        <button onClick={() => window.electronAPI.pauseTimer()}>Pause</button>
        <button onClick={() => window.electronAPI.resumeTimer()}>Resume</button>
        <button onClick={() => window.electronAPI.stopTimer()}>Stop</button>
      </div>

      <button
        onClick={() => window.electronAPI.showPip()}
        style={{ marginTop: "12px" }}
      >
        Mini view
      </button>
    </div>
  );
}
