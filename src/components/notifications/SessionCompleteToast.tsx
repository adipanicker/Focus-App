import { X } from "lucide-react";

interface SessionCompleteToastProps {
  completedType: "focus" | "break";
  onStartNext: () => void;
  onDismiss: () => void;
}

export default function SessionCompleteToast({
  completedType,
  onStartNext,
  onDismiss,
}: SessionCompleteToastProps) {
  const isFocusDone = completedType === "focus";

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-neutral-800 border border-white/08 rounded-xl shadow-[0_12px_32px_-8px_rgba(0,0,0,0.6)] p-4 z-50">
      <div className="flex justify-between items-start mb-2">
        <p className="text-sm font-medium text-neutral-50">Session finished</p>
        <button
          onClick={onDismiss}
          className="text-neutral-400 hover:text-white"
        >
          <X size={16} />
        </button>
      </div>
      <p className="text-sm text-neutral-400 mb-3">
        {isFocusDone
          ? "Nice work. Take a short break?"
          : "Break's over — ready to focus again?"}
      </p>
      <div className="flex gap-2">
        <button
          onClick={onStartNext}
          className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg py-2 transition-colors"
        >
          {isFocusDone ? "Start break" : "Start focus"}
        </button>
        <button
          onClick={onDismiss}
          className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-white text-sm rounded-lg py-2 transition-colors"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
