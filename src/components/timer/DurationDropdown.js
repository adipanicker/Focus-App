import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
export default function DurationDropdown({ valueMinutes, onChange, }) {
    const [presets, setPresets] = useState([]);
    const [showCustomDialog, setShowCustomDialog] = useState(false);
    const [customInput, setCustomInput] = useState(String(valueMinutes));
    useEffect(() => {
        window.electronAPI.getPresets().then(setPresets);
    }, []);
    const isPreset = presets.some((p) => p.minutes === valueMinutes);
    function handleSelect(e) {
        if (e.target.value === "custom") {
            setCustomInput(String(valueMinutes));
            setShowCustomDialog(true);
            return;
        }
        onChange(Number(e.target.value));
    }
    function handleCustomStart() {
        const parsed = parseInt(customInput, 10);
        if (parsed > 0) {
            onChange(parsed);
            setShowCustomDialog(false);
        }
    }
    return (_jsxs(_Fragment, { children: [_jsxs("select", { value: isPreset ? valueMinutes : "custom", onChange: handleSelect, className: "bg-neutral-800 text-white text-sm rounded-lg px-3 py-2 border border-neutral-700 focus:outline-none focus:border-neutral-500", children: [presets.map((p) => (_jsxs("option", { value: p.minutes, children: [p.minutes, " min"] }, p.id))), _jsx("option", { disabled: true, children: "\u2500\u2500\u2500\u2500\u2500\u2500" }), _jsx("option", { value: "custom", children: isPreset ? "Custom..." : `${valueMinutes} min (custom)` })] }), showCustomDialog && (_jsx("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-neutral-900 border border-neutral-700 rounded-xl p-5 w-64 flex flex-col gap-4", children: [_jsx("p", { className: "text-sm text-neutral-300", children: "Session Length" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "number", min: 1, value: customInput, onChange: (e) => setCustomInput(e.target.value), className: "w-20 bg-neutral-800 text-white text-sm rounded-lg px-3 py-2 border border-neutral-700 focus:outline-none focus:border-neutral-500", autoFocus: true }), _jsx("span", { className: "text-sm text-neutral-400", children: "minutes" })] }), _jsxs("div", { className: "flex justify-end gap-2 text-sm", children: [_jsx("button", { onClick: () => setShowCustomDialog(false), className: "px-3 py-1.5 text-neutral-400 hover:text-white", children: "Cancel" }), _jsx("button", { onClick: handleCustomStart, className: "px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-white", children: "Start" })] })] }) }))] }));
}
