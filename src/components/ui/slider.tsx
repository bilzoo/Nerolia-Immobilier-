import * as React from "react";

type SliderProps = {
  value: number[];
  min?: number;
  max?: number;
  step?: number;
  onValueChange?: (v: number[]) => void;
};

export function Slider({ value, min = 0, max = 100, step = 1, onValueChange }: SliderProps) {
  const v = value?.[0] ?? 0;
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={v}
      onChange={(e) => onValueChange?.([Number(e.target.value)])}
      className="w-full accent-black"
    />
  );
}
