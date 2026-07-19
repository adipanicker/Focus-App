import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Clock, BarChart3, Settings } from "lucide-react";
const navItems = [
    { key: "home", label: "Home", icon: Clock },
    { key: "stats", label: "Stats", icon: BarChart3 },
    { key: "settings", label: "Settings", icon: Settings },
];
export default function TitleBar({ active, onNavigate }) {
    return (_jsx("div", { className: "flex items-center bg-neutral-950 border-b border-neutral-800 select-none", style: {
            WebkitAppRegion: "drag",
            position: "fixed",
            top: "env(titlebar-area-y, 0)",
            left: "env(titlebar-area-x, 0)",
            width: "env(titlebar-area-width, 100%)",
            height: "env(titlebar-area-height, 40px)",
        }, children: _jsxs("div", { className: "flex items-center gap-5 pl-3 h-full", style: { WebkitAppRegion: "no-drag" }, children: [_jsx("span", { className: "text-sm font-medium text-white", children: "Focus" }), _jsx("div", { className: "flex items-center gap-4 text-sm h-full", children: navItems.map(({ key, label, icon: Icon }) => (_jsxs("button", { onClick: () => onNavigate(key), className: `flex items-center gap-1.5 h-full border-b-2 transition-colors ${active === key
                            ? "text-white border-blue-500"
                            : "text-neutral-400 border-transparent hover:text-neutral-200"}`, children: [_jsx(Icon, { size: 14 }), label] }, key))) })] }) }));
}
