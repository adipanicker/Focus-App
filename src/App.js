import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { useTimerState } from "@shared/hooks/useTimerState";
import TitleBar from "@/components/layout/TitleBar";
import SessionCompleteToast from "@/components/notifications/SessionCompleteToast";
import HomePage from "@/pages/HomePage";
import StatsPage from "@/pages/StatsPage";
import SettingsPage from "@/pages/SettingsPage";
export default function App() {
    const [page, setPage] = useState("home");
    const { status, type } = useTimerState();
    const [showToast, setShowToast] = useState(false);
    const prevStatus = useRef(status);
    const audioRef = useRef(null);
    useEffect(() => {
        if (prevStatus.current !== "completed" && status === "completed") {
            setShowToast(true);
            audioRef.current?.play().catch(() => { });
        }
        prevStatus.current = status;
    }, [status]);
    return (_jsxs("div", { className: "h-screen flex flex-col bg-neutral-900", children: [_jsx("audio", { ref: audioRef, src: "/sounds/complete.mp3", preload: "auto" }), _jsx(TitleBar, { active: page, onNavigate: setPage }), _jsx("div", { className: "h-10" }), " ", _jsxs("div", { className: "flex-1 overflow-y-auto p-6", children: [page === "home" && _jsx(HomePage, {}), page === "stats" && _jsx(StatsPage, {}), page === "settings" && _jsx(SettingsPage, {})] }), showToast && (_jsx(SessionCompleteToast, { completedType: type, onStartNext: () => {
                    window.electronAPI.startTimer({
                        durationSeconds: type === "focus" ? 5 * 60 : 25 * 60,
                        activityId: null,
                        type: type === "focus" ? "break" : "focus",
                    });
                    setShowToast(false);
                }, onDismiss: () => setShowToast(false) }))] }));
}
