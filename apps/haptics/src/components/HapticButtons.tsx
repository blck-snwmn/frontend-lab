const feedbacks = [
  {
    label: "Success",
    pattern: [30, 50, 30],
    className: "bg-green-600/20 border-green-700 text-green-400 hover:bg-green-600/30",
  },
  {
    label: "Warning",
    pattern: [50, 30, 50, 30, 100],
    className: "bg-yellow-600/20 border-yellow-700 text-yellow-400 hover:bg-yellow-600/30",
  },
  {
    label: "Error",
    pattern: [100, 50, 200],
    className: "bg-red-600/20 border-red-700 text-red-400 hover:bg-red-600/30",
  },
];

export function HapticButtons() {
  function play(pattern: number[]) {
    if ("vibrate" in navigator) {
      navigator.vibrate(pattern);
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-400">
        Each button triggers a different vibration pattern for its feedback type
      </p>
      <div className="flex gap-3">
        {feedbacks.map((fb) => (
          <button
            key={fb.label}
            type="button"
            onClick={() => play(fb.pattern)}
            className={`flex-1 px-4 py-3 rounded-lg border font-medium text-sm transition-colors ${fb.className}`}
          >
            {fb.label}
          </button>
        ))}
      </div>
    </div>
  );
}
