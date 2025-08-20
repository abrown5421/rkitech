import React, { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import Container from '../../../shared/components/container/Container';
import Input from '../../../shared/components/input/Input';
import type { TailwindColor, ColorPickerProps } from "./colorPickerTypes";

const COLORS: TailwindColor[] = [
  'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald',
  'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple',
  'fuchsia', 'pink', 'rose', 'slate', 'gray', 'zinc', 'neutral', 'stone',
];

const INTENSITIES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

const ColorPicker: React.FC<ColorPickerProps> = ({ label = 'Pick a color', prefix = "bg-", value = "", onChange }) => {
  const [open, setOpen] = useState(false);
  const [baseColor, setBaseColor] = useState<string>("blue");
  const [intensity, setIntensity] = useState<number>(500);
  const [opacity, setOpacity] = useState<number>(100);

  const wrapperRef = useRef<HTMLDivElement>(null);

  const colorClass = `${prefix}${baseColor}-${intensity}${opacity < 100 ? `/${opacity}` : ""}`;

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
    <div className="relative" ref={wrapperRef}>
      <Input
        label={label}
        value={colorClass}
        readOnly
        onFocus={() => setOpen(true)}
      />

      {open && (
        <Container TwClassName="flex-col absolute z-50 mt-2 p-4 bg-white border rounded-lg shadow-lg w-64">
          <Container TwClassName="grid grid-cols-5 gap-2 mb-4">
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
          </Container>

          <Container TwClassName="mb-2">
            <label className="block text-sm mb-1">Intensity: {intensity}</label>
            <Input
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
                TwClassName="w-full"
            />
          </Container>

          <Container>
            <label className="block text-sm mb-1">Opacity: {opacity}%</label>
            <Input
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
                TwClassName="w-full"
            />
          </Container>
        </Container>
      )}
    </div>
  );
};

export default ColorPicker;
