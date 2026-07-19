import { useEffect, useState } from "react";
import { useTimerState } from "@shared/hooks/useTimerState";
import { useSettings } from "@shared/hooks/useSettings";
import TimerCircle from "@/components/timer/TimerCircle";
import ActivityDropdown from "@/components/timer/ActivityDropdown";
import DurationDropdown from "@/components/timer/DurationDropdown";
import SessionControls from "@/components/timer/SessionControls";

type SessionType = "focus" | "break";

const BREAK_COLOR = "#2FB380";

export default function HomePage() {
  const { status, remainingSeconds, durationSeconds } = useTimerState();
  const { settings, updateSettings, loaded } = useSettings();
  const [activityId, setActivityId] = useState<number | null>(null);
  const [durationMinutes, setDurationMinutes] = useState(25);
  const [sessionType, setSessionType] = useState<SessionType>("focus");
  const [hasHydrated, setHasHydrated] = useState(false);

  // Pull last-used selections in once settings load, but only once —
  // otherwise every updateSettings() call below would re-trigger this
  // and stomp on whatever the user just picked.
  useEffect(() => {
    if (loaded && !hasHydrated) {
      setActivityId(settings.last_activity_id);
      setDurationMinutes(settings.last_duration_minutes);
      setHasHydrated(true);
    }
  }, [loaded, settings, hasHydrated]);

  function handleActivityChange(id: number) {
    setActivityId(id);
    updateSettings({ last_activity_id: id });
  }

  function handleDurationChange(minutes: number) {
    setDurationMinutes(minutes);
    updateSettings({ last_duration_minutes: minutes });
  }

  const isIdle = status === "idle" || status === "completed";
  const ringColor =
    sessionType === "break" ? BREAK_COLOR : settings.accent_color;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex bg-neutral-800 rounded-lg p-1 text-sm">
        <button
          onClick={() => setSessionType("focus")}
          className={`px-4 py-1.5 rounded-md transition-colors ${
            sessionType === "focus"
              ? "bg-neutral-700 text-white"
              : "text-neutral-400 hover:text-neutral-200"
          }`}
        >
          Focus
        </button>
        <button
          onClick={() => setSessionType("break")}
          className={`px-4 py-1.5 rounded-md transition-colors ${
            sessionType === "break"
              ? "bg-neutral-700 text-white"
              : "text-neutral-400 hover:text-neutral-200"
          }`}
        >
          Break
        </button>
      </div>

      <TimerCircle
        remainingSeconds={isIdle ? durationMinutes * 60 : remainingSeconds}
        durationSeconds={isIdle ? durationMinutes * 60 : durationSeconds}
        accentColor={ringColor}
      />

      <div className="flex gap-2.5 justify-center">
        {sessionType === "focus" && (
          <ActivityDropdown
            value={activityId}
            onChange={handleActivityChange}
          />
        )}
        <DurationDropdown
          valueMinutes={durationMinutes}
          onChange={handleDurationChange}
        />
      </div>

      <SessionControls
        status={status}
        onStart={() =>
          window.electronAPI.startTimer({
            durationSeconds: durationMinutes * 60,
            activityId: sessionType === "focus" ? activityId : null,
            type: sessionType,
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
