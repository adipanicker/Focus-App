import { useEffect, useState } from "react";
import type { TimerPreset } from "@shared/types";

interface DurationDropdownProps {
  valueMinutes: number;
  onChange: (minutes: number) => void;
}

export default function DurationDropdown({
  valueMinutes,
  onChange,
}: DurationDropdownProps) {
  const [presets, setPresets] = useState<TimerPreset[]>([]);
  const [showCustomDialog, setShowCustomDialog] = useState(false);
  const [customInput, setCustomInput] = useState(String(valueMinutes));

  useEffect(() => {
    window.electronAPI.getPresets().then(setPresets);
  }, []);

  const isPreset = presets.some((p) => p.minutes === valueMinutes);

  function handleSelect(e: React.ChangeEvent<HTMLSelectElement>) {
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

  return (
    <>
      <select
        value={isPreset ? valueMinutes : "custom"}
        onChange={handleSelect}
        className="bg-neutral-800 text-white text-sm rounded-lg px-3 py-2 border border-neutral-700 focus:outline-none focus:border-neutral-500"
      >
        {presets.map((p) => (
          <option key={p.id} value={p.minutes}>
            {p.minutes} min
          </option>
        ))}
        <option disabled>──────</option>
        <option value="custom">
          {isPreset ? "Custom..." : `${valueMinutes} min (custom)`}
        </option>
      </select>

      {showCustomDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-5 w-64 flex flex-col gap-4">
            <p className="text-sm text-neutral-300">Session Length</p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                className="w-20 bg-neutral-800 text-white text-sm rounded-lg px-3 py-2 border border-neutral-700 focus:outline-none focus:border-neutral-500"
                autoFocus
              />
              <span className="text-sm text-neutral-400">minutes</span>
            </div>
            <div className="flex justify-end gap-2 text-sm">
              <button
                onClick={() => setShowCustomDialog(false)}
                className="px-3 py-1.5 text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCustomStart}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-white"
              >
                Start
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
