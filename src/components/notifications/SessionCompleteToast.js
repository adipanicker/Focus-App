import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { X } from "lucide-react";
export default function SessionCompleteToast({ completedType, onStartNext, onDismiss, }) {
    const isFocusDone = completedType === "focus";
    return (_jsxs("div", { className: "fixed bottom-6 right-6 w-80 bg-neutral-800 border border-white/08 rounded-xl shadow-[0_12px_32px_-8px_rgba(0,0,0,0.6)] p-4 z-50", children: [_jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsx("p", { className: "text-sm font-medium text-neutral-50", children: "Session finished" }), _jsx("button", { onClick: onDismiss, className: "text-neutral-400 hover:text-white", children: _jsx(X, { size: 16 }) })] }), _jsx("p", { className: "text-sm text-neutral-400 mb-3", children: isFocusDone
                    ? "Nice work. Take a short break?"
                    : "Break's over — ready to focus again?" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: onStartNext, className: "flex-1 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg py-2 transition-colors", children: isFocusDone ? "Start break" : "Start focus" }), _jsx("button", { onClick: onDismiss, className: "flex-1 bg-neutral-700 hover:bg-neutral-600 text-white text-sm rounded-lg py-2 transition-colors", children: "Dismiss" })] })] }));
}
