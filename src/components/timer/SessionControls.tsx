import { Play, Pause, Square, PictureInPicture2 } from "lucide-react";
import type { TimerStatus } from "@shared/types";

interface SessionControlsProps {
  status: TimerStatus;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onMiniView: () => void;
}

export default function SessionControls({
  status,
  onStart,
  onPause,
  onResume,
  onStop,
  onMiniView,
}: SessionControlsProps) {
  const isRunning = status === "running";
  const isIdle = status === "idle" || status === "completed";

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={isRunning ? onPause : onResume}
        disabled={isIdle}
        className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-700 transition-colors"
      >
        {isRunning ? <Pause size={18} /> : <Play size={18} />}
      </button>

      <button
        onClick={isIdle ? onStart : onStop}
        className="w-14 h-14 rounded-full bg-blue-600 border-2 border-blue-400 flex items-center justify-center text-white hover:bg-blue-500 transition-colors"
      >
        {isIdle ? <Play size={20} /> : <Square size={20} />}
      </button>

      <button
        onClick={onMiniView}
        className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center text-white hover:bg-neutral-700 transition-colors"
      >
        <PictureInPicture2 size={18} />
      </button>
    </div>
  );
}
