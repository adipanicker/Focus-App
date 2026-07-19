import { jsx as _jsx } from "react/jsx-runtime";
export default function Card({ children, className = "" }) {
    return (_jsx("div", { className: `rounded-xl border border-white/6 bg-neutral-800/70 shadow-[0_8px_24px_-6px_rgba(0,0,0,0.5)] ${className}`, children: children }));
}
