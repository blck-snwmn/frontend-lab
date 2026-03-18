import { useState } from "react";

function vibrate(pattern: number | number[]) {
  if ("vibrate" in navigator) {
    navigator.vibrate(pattern);
  }
}

const presets = [
  { label: "Tap", pattern: [50], description: "50ms" },
  { label: "Long Press", pattern: [500], description: "500ms" },
  {
    label: "Double Tap",
    pattern: [50, 100, 50],
    description: "50-100-50ms",
  },
  {
    label: "Triple Tap",
    pattern: [50, 80, 50, 80, 50],
    description: "50-80-50-80-50ms",
  },
  {
    label: "SOS",
    pattern: [100, 50, 100, 50, 100, 150, 300, 50, 300, 50, 300, 150, 100, 50, 100, 50, 100],
    description: "··· −−− ···",
  },
  {
    label: "Heartbeat",
    pattern: [100, 100, 200, 400],
    description: "ba-dum",
  },
  {
    label: "Notification",
    pattern: [50, 50, 100],
    description: "short buzz",
  },
];

export function VibrationPatterns() {
  const [customInput, setCustomInput] = useState("50, 100, 50");
  const [lastPlayed, setLastPlayed] = useState<string | null>(null);
  const supported = "vibrate" in navigator;

  function playPattern(label: string, pattern: number | number[]) {
    vibrate(pattern);
    setLastPlayed(label);
  }

  function playCustom() {
    const parts = customInput
      .split(",")
      .map((s) => Number.parseInt(s.trim(), 10))
      .filter((n) => !Number.isNaN(n) && n >= 0);
    if (parts.length > 0) {
      playPattern("Custom", parts);
    }
  }

  function stop() {
    vibrate(0);
    setLastPlayed(null);
  }

  return (
    <div className="space-y-6">
      {!supported && (
        <div className="p-4 bg-yellow-900/40 border border-yellow-700 rounded-lg text-yellow-300 text-sm">
          This browser does not support the Vibration API. Try on Android Chrome.
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {presets.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => playPattern(preset.label, preset.pattern)}
            className={`p-4 rounded-lg border transition-colors text-left ${
              lastPlayed === preset.label
                ? "border-blue-500 bg-blue-500/10"
                : "border-gray-700 bg-gray-900 hover:border-gray-500"
            }`}
          >
            <div className="font-medium text-sm">{preset.label}</div>
            <div className="text-xs text-gray-500 mt-1">{preset.description}</div>
          </button>
        ))}
      </div>

      <div className="p-4 bg-gray-900 rounded-lg border border-gray-700 space-y-3">
        <label className="block text-sm font-medium">
          Custom Pattern
          <span className="text-gray-500 font-normal ml-2">(comma-separated ms values)</span>
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="50, 100, 50, 100, 200"
            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-sm focus:outline-none focus:border-blue-500"
          />
          <button
            type="button"
            onClick={playCustom}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
          >
            Play
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={stop}
        className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-700 text-red-400 rounded-lg text-sm font-medium transition-colors"
      >
        Stop Vibration
      </button>
    </div>
  );
}
