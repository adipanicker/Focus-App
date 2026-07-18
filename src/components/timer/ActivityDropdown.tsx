import { useEffect, useState } from "react";
import type { Activity } from "@shared/types";

interface ActivityDropdownProps {
  value: number | null;
  onChange: (activityId: number) => void;
}

export default function ActivityDropdown({
  value,
  onChange,
}: ActivityDropdownProps) {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    window.electronAPI.getActivities().then((list) => {
      setActivities(list);
      if (value === null && list.length > 0) {
        onChange(list[0].id); // default to first activity once loaded
      }
    });
  }, []);

  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange(Number(e.target.value))}
      className="bg-neutral-800 text-white text-sm rounded-lg px-3 py-2 border border-neutral-700 focus:outline-none focus:border-neutral-500"
    >
      {activities.map((a) => (
        <option key={a.id} value={a.id}>
          {a.name}
        </option>
      ))}
    </select>
  );
}
