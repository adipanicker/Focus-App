import { useState } from "react";
import { useTimerState } from "@shared/hooks/useTimerState";
import { useSettings } from "@shared/hooks/useSettings";
import TimerCircle from "@/components/timer/TimerCircle";
import ActivityDropdown from "@/components/timer/ActivityDropdown";
import DurationDropdown from "@/components/timer/DurationDropdown";
import SessionControls from "@/components/timer/SessionControls";

export default function HomePage() {
  const { status, remainingSeconds, durationSeconds } = useTimerState();
  const { settings } = useSettings();
  const [activityId, setActivityId] = useState<number | null>(null);
  const [durationMinutes, setDurationMinutes] = useState(25);

  const isIdle = status === "idle" || status === "completed";

  return (
    <div className="flex flex-col items-center gap-6">
      <TimerCircle
        remainingSeconds={isIdle ? durationMinutes * 60 : remainingSeconds}
        durationSeconds={isIdle ? durationMinutes * 60 : durationSeconds}
        accentColor={settings.accent_color}
      />

      <div className="flex gap-2.5 w-full">
        <ActivityDropdown value={activityId} onChange={setActivityId} />
        <DurationDropdown
          valueMinutes={durationMinutes}
          onChange={setDurationMinutes}
        />
      </div>

      <SessionControls
        status={status}
        onStart={() =>
          window.electronAPI.startTimer({
            durationSeconds: durationMinutes * 60,
            activityId, // TEMP — see note below
            type: "focus",
          })
        }
        onPause={() => window.electronAPI.pauseTimer()}
        onResume={() => window.electronAPI.resumeTimer()}
        onStop={() => window.electronAPI.stopTimer()}
        onMiniView={() => window.electronAPI.showPip()}
      />
    </div>
  );
}
