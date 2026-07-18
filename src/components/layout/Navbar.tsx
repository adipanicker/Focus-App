import { Clock, BarChart3, Settings } from "lucide-react";

type Page = "home" | "stats" | "settings";

interface NavBarProps {
  active: Page;
  onNavigate: (page: Page) => void;
}

const items: { key: Page; label: string; icon: typeof Clock }[] = [
  { key: "home", label: "Home", icon: Clock },
  { key: "stats", label: "Stats", icon: BarChart3 },
  { key: "settings", label: "Settings", icon: Settings },
];

export default function NavBar({ active, onNavigate }: NavBarProps) {
  return (
    <div className="flex justify-between w-full text-sm">
      {items.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => onNavigate(key)}
          className={`flex items-center gap-1.5 transition-colors ${
            active === key
              ? "text-white font-medium"
              : "text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <Icon size={15} />
          {label}
        </button>
      ))}
    </div>
  );
}
