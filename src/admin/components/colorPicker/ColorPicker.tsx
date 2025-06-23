import React, { useState, useEffect, useRef } from 'react';
import { InputField } from '../../../components/InputField/InputField';

export type TailwindColor =
  | 'red' | 'orange' | 'amber' | 'yellow' | 'lime' | 'green' | 'emerald'
  | 'teal' | 'cyan' | 'sky' | 'blue' | 'indigo' | 'violet' | 'purple'
  | 'fuchsia' | 'pink' | 'rose' | 'slate' | 'gray' | 'zinc' | 'neutral' | 'stone';

export type TailwindIntensity =
  | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;

export interface ColorPickerProps {
  defaultColor?: TailwindColor;
  defaultIntensity?: TailwindIntensity;
  defaultOpacity?: number;
  base?: string;
  onChange?: (className: string) => void;
  label?: string;
}

const COLORS: TailwindColor[] = [
  'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald',
  'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple',
  'fuchsia', 'pink', 'rose', 'slate', 'gray', 'zinc', 'neutral', 'stone',
];

const INTENSITIES: TailwindIntensity[] = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
];

const ColorPicker: React.FC<ColorPickerProps> = ({
  defaultColor = 'blue',
  defaultIntensity = 500,
  defaultOpacity = 100,
  base = 'bg',
  onChange,
  label = 'Color Picker',
}) => {
  const [color, setColor] = useState<TailwindColor>(defaultColor);
  const [intensity, setIntensity] = useState<TailwindIntensity>(defaultIntensity);
  const [opacity, setOpacity] = useState<number>(defaultOpacity);
  const [showPicker, setShowPicker] = useState<boolean>(false);

  const pickerRef = useRef<HTMLDivElement>(null);

  const tailwindClass = `${base}-${color}-${intensity}`;
  const opacityClass = opacity < 100 ? `/${opacity}` : '';
  const finalClass = `${tailwindClass}${opacityClass}`;

  useEffect(() => {
    if (onChange) onChange(`${base}-${color}-${intensity}${opacity < 100 ? `/${opacity}` : ''}`);
  }, [color, intensity, opacity]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-sm">
      <InputField
        label={label}
        name="color-picker"
        value={`${color}-${intensity}${opacity < 100 ? `/${opacity}` : ''}`}
        iconStart={
            <div className={`w-4 h-4 rounded-full ${tailwindClass}${opacity < 100 ? `/${opacity}` : ''}`} />
        }
        inputClasses={['cursor-pointer']}
        onClick={() => setShowPicker(true)} 
        onFocus={() => setShowPicker(true)} 
        readOnly
      />

      {showPicker && (
        <div
          ref={pickerRef}
          className="absolute z-50 mt-2 p-4 border bg-white rounded-lg shadow-md space-y-4"
        >
          <div>
            <label className="block text-sm font-medium mb-1">Color</label>
            <div className="flex flex-wrap gap-2 max-w-xs">
              {COLORS.map((c) => (
                <div
                  key={c}
                  className={`w-6 h-6 rounded-full cursor-pointer ${base}-${c}-500 ${color === c ? 'ring-2 ring-black' : ''}`}
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
              className="w-full"
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
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Preview</label>
            <div className={`w-full h-12 rounded ${finalClass}`} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
