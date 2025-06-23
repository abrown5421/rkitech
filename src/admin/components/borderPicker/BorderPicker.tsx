import React, { useState, useEffect } from 'react';
import { InputField } from '../../../components/InputField/InputField';
import ColorPicker from '../colorPicker/ColorPicker';

interface BorderPickerProps {
  defaultWidth?: number;
  defaultStyle?: string;
  defaultColorClass?: string;
  onChange?: (className: string) => void;
  label?: string;
}

const BORDER_STYLES = ['solid', 'dashed', 'dotted', 'double', 'none'];

const BorderPicker: React.FC<BorderPickerProps> = ({
  defaultWidth = 1,
  defaultStyle = 'solid',
  defaultColorClass = 'border-gray-300',
  onChange,
  label = 'Border Picker',
}) => {
  const [width, setWidth] = useState<number>(defaultWidth);
  const [style, setStyle] = useState<string>(defaultStyle);
  const [colorClass, setColorClass] = useState<string>(defaultColorClass);

  const getClassName = () => {
    const widthClass = width === 0 ? 'border-none' : `border-[${width}px]`;
    return `${widthClass} border-${style} ${colorClass}`;
  };

  useEffect(() => {
    if (onChange) onChange(getClassName());
  }, [width, style, colorClass]);

  return (
    <div className="w-full">
      
        <div className='flex flex-row w-full gap-4'>

            <InputField
                label="Width (px)"
                type="number"
                min={0}
                value={width}
                onChange={(e) => {
                const val = Math.max(0, parseInt(e.target.value) || 0);
                setWidth(val);
                }}
                twClasses={['flex flex-col flex-1/2']}
            />

            <div className='flex flex-col flex-1/2'>
                <label className="block text-sm font-medium mb-1">Style</label>
                <select
                className="w-full border rounded-lg px-3 py-2"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                >
                {BORDER_STYLES.map((s) => (
                    <option key={s} value={s}>
                    {s}
                    </option>
                ))}
                </select>
            </div>

            <ColorPicker
                base="border"
                label="Color"
                onChange={(className) => setColorClass(className)}
            />

        </div>
      
    </div>
  );
};

export default BorderPicker;
