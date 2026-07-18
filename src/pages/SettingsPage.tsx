import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useSettings } from "@shared/hooks/useSettings";
import type { Activity, TimerPreset } from "@shared/types";

const ACCENT_PRESETS = ["#378ADD", "#7C5CFC", "#2FB380", "#EF9F27", "#E15A5A"];

export default function SettingsPage() {
  const { settings, updateSettings } = useSettings();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [presets, setPresets] = useState<TimerPreset[]>([]);
  const [editingActivityId, setEditingActivityId] = useState<number | null>(
    null,
  );
  const [editingPresetId, setEditingPresetId] = useState<number | null>(null);

  function loadActivities() {
    window.electronAPI.getActivities().then(setActivities);
  }
  function loadPresets() {
    window.electronAPI.getPresets().then(setPresets);
  }

  useEffect(() => {
    loadActivities();
    loadPresets();
  }, []);

  return (
    <div className="flex flex-col gap-6 max-w-md">
      <div>
        <p className="text-xs text-neutral-400 uppercase tracking-wide mb-2.5">
          Accent color
        </p>
        <div className="flex gap-2.5">
          {ACCENT_PRESETS.map((color) => (
            <button
              key={color}
              onClick={() => updateSettings({ accent_color: color })}
              style={{ background: color }}
              className={`w-7 h-7 rounded-full ${
                settings.accent_color === color
                  ? "ring-2 ring-white ring-offset-2 ring-offset-neutral-900"
                  : ""
              }`}
            />
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2.5">
          <p className="text-xs text-neutral-400 uppercase tracking-wide">
            Timer presets
          </p>
          <button
            onClick={async () => {
              await window.electronAPI.addPreset(15);
              loadPresets();
            }}
            className="text-xs flex items-center gap-1 px-2.5 py-1 bg-neutral-800 rounded-md text-white hover:bg-neutral-700"
          >
            <Plus size={13} /> Add
          </button>
        </div>
        <div className="flex flex-col gap-1.5">
          {presets.map((p) => (
            <PresetRow
              key={p.id}
              preset={p}
              isEditing={editingPresetId === p.id}
              onEdit={() => setEditingPresetId(p.id)}
              onCancel={() => setEditingPresetId(null)}
              onSave={async (minutes) => {
                await window.electronAPI.updatePreset({ id: p.id, minutes });
                setEditingPresetId(null);
                loadPresets();
              }}
              onDelete={async () => {
                await window.electronAPI.deletePreset(p.id);
                loadPresets();
              }}
            />
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2.5">
          <p className="text-xs text-neutral-400 uppercase tracking-wide">
            Session presets
          </p>
          <button
            onClick={async () => {
              await window.electronAPI.addActivity({
                name: "New activity",
                color: ACCENT_PRESETS[0],
              });
              loadActivities();
            }}
            className="text-xs flex items-center gap-1 px-2.5 py-1 bg-neutral-800 rounded-md text-white hover:bg-neutral-700"
          >
            <Plus size={13} /> Add
          </button>
        </div>
        <div className="flex flex-col gap-1.5">
          {activities.map((a) => (
            <ActivityRow
              key={a.id}
              activity={a}
              isEditing={editingActivityId === a.id}
              onEdit={() => setEditingActivityId(a.id)}
              onCancel={() => setEditingActivityId(null)}
              onSave={async (name, color) => {
                await window.electronAPI.updateActivity({
                  id: a.id,
                  name,
                  color,
                });
                setEditingActivityId(null);
                loadActivities();
              }}
              onDelete={async () => {
                await window.electronAPI.deleteActivity(a.id);
                loadActivities();
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function PresetRow({
  preset,
  isEditing,
  onEdit,
  onCancel,
  onSave,
  onDelete,
}: {
  preset: TimerPreset;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: (minutes: number) => void;
  onDelete: () => void;
}) {
  const [minutes, setMinutes] = useState(preset.minutes);

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 bg-neutral-800 rounded-lg px-3 py-2">
        <input
          type="number"
          min={1}
          value={minutes}
          onChange={(e) => setMinutes(Number(e.target.value))}
          className="w-16 bg-neutral-900 text-white text-sm rounded px-2 py-1 border border-neutral-700"
          autoFocus
        />
        <span className="text-sm text-neutral-400">min</span>
        <div className="ml-auto flex gap-2 text-xs">
          <button
            onClick={onCancel}
            className="text-neutral-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(minutes)}
            className="text-blue-400 hover:text-blue-300"
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center bg-neutral-800 rounded-lg px-3 py-2 text-sm">
      <span>{preset.minutes} min</span>
      <span className="flex gap-2.5 text-neutral-400">
        <button onClick={onEdit} className="hover:text-white">
          <Pencil size={14} />
        </button>
        <button onClick={onDelete} className="hover:text-white">
          <Trash2 size={14} />
        </button>
      </span>
    </div>
  );
}

function ActivityRow({
  activity,
  isEditing,
  onEdit,
  onCancel,
  onSave,
  onDelete,
}: {
  activity: Activity;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: (name: string, color: string) => void;
  onDelete: () => void;
}) {
  const [name, setName] = useState(activity.name);
  const [color, setColor] = useState(activity.color);

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 bg-neutral-800 rounded-lg px-3 py-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 bg-neutral-900 text-white text-sm rounded px-2 py-1 border border-neutral-700"
          autoFocus
        />
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-7 h-7 rounded cursor-pointer bg-transparent border-none"
        />
        <div className="flex gap-2 text-xs">
          <button
            onClick={onCancel}
            className="text-neutral-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(name, color)}
            className="text-blue-400 hover:text-blue-300"
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center bg-neutral-800 rounded-lg px-3 py-2 text-sm">
      <span className="flex items-center gap-2">
        <span
          className="w-2 h-2 rounded-full"
          style={{ background: activity.color }}
        />
        {activity.name}
      </span>
      <span className="flex gap-2.5 text-neutral-400">
        <button onClick={onEdit} className="hover:text-white">
          <Pencil size={14} />
        </button>
        <button onClick={onDelete} className="hover:text-white">
          <Trash2 size={14} />
        </button>
      </span>
    </div>
  );
}
