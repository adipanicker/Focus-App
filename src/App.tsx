import { useEffect, useRef, useState } from "react";
import { useTimerState } from "@shared/hooks/useTimerState";
import TitleBar from "@/components/layout/TitleBar";
import SessionCompleteToast from "@/components/notifications/SessionCompleteToast";
import HomePage from "@/pages/HomePage";
import StatsPage from "@/pages/StatsPage";
import SettingsPage from "@/pages/SettingsPage";

type Page = "home" | "stats" | "settings";

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const { status, type } = useTimerState();
  const [showToast, setShowToast] = useState(false);
  const prevStatus = useRef(status);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (prevStatus.current !== "completed" && status === "completed") {
      setShowToast(true);
      audioRef.current?.play().catch(() => {});
    }
    prevStatus.current = status;
  }, [status]);

  return (
    <div className="h-screen flex flex-col bg-neutral-900">
      <audio ref={audioRef} src="/sounds/complete.mp3" preload="auto" />
      <TitleBar active={page} onNavigate={setPage} />
      <div className="h-10" />{" "}
      {/* your existing spacer stays here, unchanged */}
      <div className="flex-1 overflow-y-auto p-6">
        {page === "home" && <HomePage />}
        {page === "stats" && <StatsPage />}
        {page === "settings" && <SettingsPage />}
      </div>
      {showToast && (
        <SessionCompleteToast
          completedType={type}
          onStartNext={() => {
            window.electronAPI.startTimer({
              durationSeconds: type === "focus" ? 5 * 60 : 25 * 60,
              activityId: null,
              type: type === "focus" ? "break" : "focus",
            });
            setShowToast(false);
          }}
          onDismiss={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
