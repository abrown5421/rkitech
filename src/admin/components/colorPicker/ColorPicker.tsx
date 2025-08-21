import React, { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import Container from '../../../shared/components/container/Container';
import Input from '../../../shared/components/input/Input';
import type { TailwindColor, ColorPickerProps } from "./colorPickerTypes";
import { tailwindToHex } from "../../../shared/utils/tailwindToHex";

const COLORS: TailwindColor[] = [
  'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald',
  'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple',
  'fuchsia', 'pink', 'rose', 'slate', 'gray', 'zinc', 'neutral', 'stone',
];

const INTENSITIES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

const ColorPicker: React.FC<ColorPickerProps> = ({ label = 'Pick a color', prefix = "bg-", value = "", onChange, TwClassName = '' }) => {
  const classString = Array.isArray(TwClassName) ? TwClassName.join(' ') : TwClassName || '';
  const [open, setOpen] = useState(false);
  const [baseColor, setBaseColor] = useState<string>("blue");
  const [intensity, setIntensity] = useState<number>(500);
  const [opacity, setOpacity] = useState<number>(100);

  const wrapperRef = useRef<HTMLDivElement>(null);

  const colorClass = `${prefix}${baseColor}-${intensity}${opacity < 100 ? `/${opacity}` : ""}`;

  function hexToRgba(hex: string, alpha: number) {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  useEffect(() => {
    if (!value) return;

    const regex = new RegExp(`^${prefix}(\\w+)-(\\d+)(?:/(\\d+))?$`);
    const match = value.match(regex);

    if (match) {
        const [, color, intensityStr, opacityStr] = match;

        setBaseColor((prev) => (prev !== color ? color : prev));
        setIntensity((prev) => (prev !== Number(intensityStr) ? Number(intensityStr) : prev));
        setOpacity((prev) => (prev !== (opacityStr ? Number(opacityStr) : 100) ? (opacityStr ? Number(opacityStr) : 100) : prev));
    }
  }, [value, prefix]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={clsx("relative", classString)} ref={wrapperRef}>
      <Input
        label={label}
        value={colorClass}
        readOnly
        onFocus={() => setOpen(true)}
      />

      {open && (
        <Container TwClassName="flex-col absolute z-50 mt-2 p-4 bg-gray-50 border rounded-lg shadow-lg">
          <Container TwClassName="flex-row flex-wrap gap-2 mb-4">
            {COLORS.map(color => (
              <button
                key={color}
                className={clsx(
                    "w-8 h-8 rounded-full border-2",
                    baseColor === color ? "border-black" : "border-gray-200",
                    `bg-${color}-500`
                )}
                onClick={() => {
                    setBaseColor(color);
                    onChange?.(`${prefix}${color}-${intensity}${opacity < 100 ? `/${opacity}` : ""}`);
                }}
              />

            ))}
            <button
              key="none"
              className={clsx(
                "w-8 h-8 rounded-full border-2 flex items-center justify-center",
                value === "transparent" ? "border-black" : "border-gray-200",
                "bg-white"
              )}
              onClick={() => {
                setBaseColor("");
                setIntensity(500);
                setOpacity(100);
                onChange?.(prefix + "transparent");
              }}
            >
              ✕
            </button>
          </Container>

          <Container TwClassName="flex-col mb-2">
            <label className="block text-sm mb-1">Intensity: {intensity}</label>
            <input
              type="range"
              min={0}
              max={INTENSITIES.length - 1}
              step={1}
              value={INTENSITIES.indexOf(intensity)}
              onChange={(e) => {
                const index = Number(e.target.value);
                const newIntensity = INTENSITIES[index];
                setIntensity(newIntensity);
                onChange?.(`${prefix}${baseColor}-${newIntensity}${opacity < 100 ? `/${opacity}` : ""}`);
              }}
              style={{
                background: `linear-gradient(to right, ${INTENSITIES.map(i => tailwindToHex(baseColor, i)).join(', ')})`
              }}
              className="h-2 rounded-lg appearance-none"
            />
          </Container>

          <Container TwClassName="flex-col">
            <label className="block text-sm mb-1">Opacity: {opacity}%</label>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={opacity}
              onChange={(e) => {
                const newOpacity = Number(e.target.value);
                setOpacity(newOpacity);
                onChange?.(`${prefix}${baseColor}-${intensity}${newOpacity < 100 ? `/${newOpacity}` : ""}`);
              }}
              style={{
                background: `linear-gradient(to right, ${hexToRgba(tailwindToHex(baseColor, intensity), 0.1)}, ${hexToRgba(tailwindToHex(baseColor, intensity), 1)})`
              }}
              className="h-2 rounded-lg appearance-none"
            />
          </Container>
        </Container>
      )}
    </div>
  );
};

export default ColorPicker;
