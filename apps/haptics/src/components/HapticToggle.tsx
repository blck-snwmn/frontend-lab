import { useState } from "react";

export function HapticToggle() {
  const [enabled, setEnabled] = useState(false);

  function toggle() {
    const next = !enabled;
    setEnabled(next);

    if ("vibrate" in navigator) {
      if (next) {
        navigator.vibrate([30, 50, 30]);
      } else {
        navigator.vibrate(20);
      }
    }
  }

  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="font-medium">Haptic Toggle</div>
        <div className="text-sm text-gray-500">
          {enabled ? "ON — double pulse" : "OFF — single pulse"}
        </div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={toggle}
        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
          enabled ? "bg-blue-600" : "bg-gray-600"
        }`}
      >
        <span
          className={`inline-block h-6 w-6 rounded-full bg-white transition-transform ${
            enabled ? "translate-x-7" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
