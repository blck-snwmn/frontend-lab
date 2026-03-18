import { useRef, useState } from "react";

export function HapticSlider() {
  const [value, setValue] = useState(50);
  const lastStep = useRef(value);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = Number(e.target.value);
    const step = 5;
    const currentStep = Math.floor(next / step);
    const previousStep = Math.floor(lastStep.current / step);

    if (currentStep !== previousStep && "vibrate" in navigator) {
      navigator.vibrate(10);
    }

    lastStep.current = next;
    setValue(next);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-400">Drag the slider — feel a tick every 5 steps</span>
        <span className="text-2xl font-mono font-bold tabular-nums">{value}</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={handleChange}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
      />
      <div className="flex justify-between text-xs text-gray-600">
        <span>0</span>
        <span>25</span>
        <span>50</span>
        <span>75</span>
        <span>100</span>
      </div>
    </div>
  );
}
