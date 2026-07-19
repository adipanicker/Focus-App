import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Clock, BarChart3, Settings } from "lucide-react";
const items = [
    { key: "home", label: "Home", icon: Clock },
    { key: "stats", label: "Stats", icon: BarChart3 },
    { key: "settings", label: "Settings", icon: Settings },
];
export default function NavBar({ active, onNavigate }) {
    return (_jsx("div", { className: "flex justify-between w-full text-sm", children: items.map(({ key, label, icon: Icon }) => (_jsxs("button", { onClick: () => onNavigate(key), className: `flex items-center gap-1.5 transition-colors ${active === key
                ? "text-white font-medium"
                : "text-neutral-400 hover:text-neutral-200"}`, children: [_jsx(Icon, { size: 15 }), label] }, key))) }));
}
