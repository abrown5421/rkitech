import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import type { ColorPickerProps, TailwindColor, TailwindIntensity } from "./colorPickerTypes";
import Input from "../input/Input";
import { tailwindToHex } from "../../utils/tailwindToHex";



const COLORS: TailwindColor[] = [
  "red", "orange", "amber", "yellow", "lime", "green", "emerald",
  "teal", "cyan", "sky", "blue", "indigo", "violet", "purple",
  "fuchsia", "pink", "rose", "slate", "gray", "zinc", "neutral", "stone",
];

const INTENSITIES: TailwindIntensity[] = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
];

const ColorPicker: React.FC<ColorPickerProps> = ({
  defaultColor = "blue",
  defaultIntensity = 500,
  defaultOpacity = 100,
  base = "bg",
  onChange,
  label,
  helperText,
  TwClassName,
}) => {
  const [color, setColor] = useState<TailwindColor>(defaultColor);
  const [intensity, setIntensity] = useState<TailwindIntensity>(defaultIntensity);
  const [opacity, setOpacity] = useState<number>(defaultOpacity);
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  const className = `${base}-${color}-${intensity}${opacity < 100 ? `/${opacity}` : ""}`;

  useEffect(() => {
    if (onChange) onChange(className);
  }, [color, intensity, opacity]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-sm">
      <Input
        label={label}
        TwClassName={TwClassName}
        value={className}
        readOnly
        onFocus={() => setShowPicker(true)}
        onClick={() => setShowPicker(true)}
        endAdornment={
          <div
            className={clsx(
              `w-5 h-5 rounded-full border border-gray-400`,
              `bg-${color}-${intensity}`
            )}
            style={{ opacity: opacity / 100 }}
          />
        }
        helperText={helperText}
      />

      {showPicker && (
        <div
          ref={pickerRef}
          className="absolute z-50 mt-2 p-4 w-full border bg-white rounded-lg shadow space-y-4"
        >
          <div>
            <label className="block text-sm font-medium mb-1">Color</label>
            <div className="flex flex-wrap gap-2 max-w-xs">
              {COLORS.map((c) => (
                <div
                  key={c}
                  className={`w-6 h-6 rounded-full cursor-pointer bg-${c}-500 ${color === c ? "ring-2 ring-black" : ""}`}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Intensity ({intensity})
            </label>
            <input
              type="range"
              min={0}
              max={INTENSITIES.length - 1}
              value={INTENSITIES.indexOf(intensity)}
              onChange={(e) => setIntensity(INTENSITIES[+e.target.value])}
              className="w-full h-2 appearance-none rounded-lg outline-none"
              style={{
                background: `linear-gradient(
                  to right,
                  ${tailwindToHex(color, 50)},
                  ${tailwindToHex(color, 400)},
                  ${tailwindToHex(color, 700)},
                  ${tailwindToHex(color, 950)}
                )`,
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Opacity ({opacity}%)
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={opacity}
              onChange={(e) => setOpacity(+e.target.value)}
              className="w-full h-2 appearance-none rounded-lg outline-none"
              style={{
                background: `linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,1))`,
              }}
            />
          </div>

          <div className="flex justify-end">
            <button
              className="text-amber-500 hover:text-amber-600 text-sm"
              onClick={() => setShowPicker(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;