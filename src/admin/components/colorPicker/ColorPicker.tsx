import React, { useState, useEffect } from 'react';

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
}) => {
  const [color, setColor] = useState<TailwindColor>(defaultColor);
  const [intensity, setIntensity] = useState<TailwindIntensity>(defaultIntensity);
  const [opacity, setOpacity] = useState<number>(defaultOpacity);

  const tailwindClass = `${base}-${color}-${intensity}`;
  const opacityClass = opacity < 100 ? `${tailwindClass}/${opacity}` : '';
  const finalClass = `${tailwindClass} ${opacityClass}`.trim();

  useEffect(() => {
    if (onChange) onChange(finalClass);
  }, [color, intensity, opacity, base]);

  return (
    <div className="space-y-4 p-4 border rounded-lg w-full max-w-sm bg-gray-50">
      <div>
        <label className="block font-medium mb-1">Color</label>
        <div className="flex flex-wrap gap-2">
            {COLORS.map((c) => (
                <div
                key={c}
                className={`
                    w-8 h-8 rounded-full cursor-pointer
                    ${base}-${c}-500
                    ${color === c ? 'ring-2 ring-black' : ''}
                `}
                onClick={() => setColor(c)}
                />
            ))}
            </div>
      </div>

      <div>
        <label className="block font-medium mb-1">
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
        <label className="block font-medium mb-1">
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

      <div className="mt-4">
        <div className="text-sm text-gray-600 mb-2">Preview:</div>
        <div
          className={`w-full h-16 rounded ${finalClass}`}
        />
        <div className="text-xs mt-2 break-words">
          <code>{finalClass}</code>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
