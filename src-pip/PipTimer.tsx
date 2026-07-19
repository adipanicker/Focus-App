import { useTimerState } from "@shared/hooks/useTimerState";
import { Pause, Play, Square, Maximize2 } from "lucide-react";

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function PipTimer() {
  const { status, remainingSeconds } = useTimerState();

  return (
    <div
      className="w-full h-full rounded-2xl flex flex-col justify-between p-3 backdrop-blur-xl"
      style={
        {
          background: "rgba(23, 23, 23, 0.72)",
          border: "1px solid rgba(255,255,255,0.08)",
          WebkitAppRegion: "drag",
        } as React.CSSProperties
      }
    >
      <div style={{ WebkitAppRegion: "drag" } as React.CSSProperties}>
        <p className="text-3xl font-mono font-medium text-white leading-none">
          {formatTime(remainingSeconds)}
        </p>
        <p className="text-[11px] text-neutral-400 mt-1 capitalize">{status}</p>
      </div>

      <div
        className="flex gap-2"
        style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
      >
        <button
          onClick={() =>
            status === "running"
              ? window.electronAPI.pauseTimer()
              : window.electronAPI.resumeTimer()
          }
          className="w-6 h-6 rounded-lg flex items-center justify-center text-white bg-blue-600 hover:bg-blue-500 transition-colors"
        >
          {status === "running" ? <Pause size={14} /> : <Play size={14} />}
        </button>
        <button
          onClick={() => window.electronAPI.stopTimer()}
          className="w-6 h-6 rounded-lg flex items-center justify-center text-white bg-blue-600 hover:bg-blue-500 transition-colors"
        >
          <Square size={14} />
        </button>
        <button
          onClick={() => window.electronAPI.showMain()}
          className="w-6 h-6 rounded-lg flex items-center justify-center text-white bg-blue-600 hover:bg-blue-500 transition-colors"
        >
          <Maximize2 size={14} />
        </button>
      </div>
    </div>
  );
}
