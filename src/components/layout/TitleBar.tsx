import { Clock, BarChart3, Settings } from "lucide-react";

type Page = "home" | "stats" | "settings";

interface TitleBarProps {
  active: Page;
  onNavigate: (page: Page) => void;
}

const navItems: { key: Page; label: string; icon: typeof Clock }[] = [
  { key: "home", label: "Home", icon: Clock },
  { key: "stats", label: "Stats", icon: BarChart3 },
  { key: "settings", label: "Settings", icon: Settings },
];

export default function TitleBar({ active, onNavigate }: TitleBarProps) {
  return (
    <div
      className="flex items-center bg-neutral-950 border-b border-neutral-800 select-none"
      style={
        {
          WebkitAppRegion: "drag",
          position: "fixed",
          top: "env(titlebar-area-y, 0)",
          left: "env(titlebar-area-x, 0)",
          width: "env(titlebar-area-width, 100%)",
          height: "env(titlebar-area-height, 40px)",
        } as React.CSSProperties
      }
    >
      <div
        className="flex items-center gap-5 pl-3 h-full"
        style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
      >
        <span className="text-sm font-medium text-white">Focus</span>
        <div className="flex items-center gap-4 text-sm h-full">
          {navItems.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              className={`flex items-center gap-1.5 h-full border-b-2 transition-colors ${
                active === key
                  ? "text-white border-blue-500"
                  : "text-neutral-400 border-transparent hover:text-neutral-200"
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
