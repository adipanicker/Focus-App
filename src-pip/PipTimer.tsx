import { useTimerState } from "@shared/hooks/useTimerState";

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function PipTimer() {
  const { status, remainingSeconds } = useTimerState();

  return (
    <div
      style={
        {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "10px",
          color: "black",
          WebkitAppRegion: "drag",
        } as React.CSSProperties
      }
    >
      <p
        style={
          {
            margin: 0,
            fontSize: "20px",
            fontFamily: "monospace",
            WebkitAppRegion: "drag",
          } as React.CSSProperties
        }
      >
        {formatTime(remainingSeconds)}{" "}
        <span style={{ fontSize: "11px", opacity: 0.6 }}>{status}</span>
      </p>

      <div
        style={
          {
            display: "flex",
            gap: "6px",
            WebkitAppRegion: "no-drag",
          } as React.CSSProperties
        }
      >
        <button
          onClick={() =>
            status === "running"
              ? window.electronAPI.pauseTimer()
              : window.electronAPI.resumeTimer()
          }
        >
          {status === "running" ? "⏸" : "▶"}
        </button>
        <button onClick={() => window.electronAPI.stopTimer()}>⏹</button>
        <button onClick={() => window.electronAPI.showMain()}>↗️</button>
      </div>
    </div>
  );
}
