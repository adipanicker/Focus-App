import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Play, Pause, Square, PictureInPicture2 } from "lucide-react";
export default function SessionControls({ status, onStart, onPause, onResume, onStop, onMiniView, }) {
    const isRunning = status === "running";
    const isIdle = status === "idle" || status === "completed";
    return (_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("button", { onClick: isRunning ? onPause : onResume, disabled: isIdle, className: "w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-700 transition-colors", children: isRunning ? _jsx(Pause, { size: 18 }) : _jsx(Play, { size: 18 }) }), _jsx("button", { onClick: isIdle ? onStart : onStop, className: "w-14 h-14 rounded-full bg-blue-600 border-2 border-blue-400 flex items-center justify-center text-white hover:bg-blue-500 transition-colors", children: isIdle ? _jsx(Play, { size: 20 }) : _jsx(Square, { size: 20 }) }), _jsx("button", { onClick: onMiniView, className: "w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center text-white hover:bg-neutral-700 transition-colors", children: _jsx(PictureInPicture2, { size: 18 }) })] }));
}
