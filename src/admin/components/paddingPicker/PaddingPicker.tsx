import React, { useState, useEffect } from 'react';
import { InputField } from '../../../components/InputField/InputField';
import type { PaddingPickerProps } from './paddingPickerTypes';

const suffixes = [
  '0', '1', '2', '3', '4', '5', '6', '7', '8',
  '10', '12', '16', '20', '24', '32', '40', '48', '56', '64'
];

const PaddingPicker: React.FC<PaddingPickerProps> = ({
  defaultValues = { top: 0, right: 0, bottom: 0, left: 0 },
  onChange
}) => {
  const [paddings, setPaddings] = useState({
    top: defaultValues.top ?? 0,
    right: defaultValues.right ?? 0,
    bottom: defaultValues.bottom ?? 0,
    left: defaultValues.left ?? 0,
  });

  const clamp = (val: number) => {
    if (val < 0) return 0;
    if (val >= suffixes.length) return suffixes.length - 1;
    return val;
  };

  const updatePadding = (side: keyof typeof paddings, value: string) => {
    const numericVal = parseInt(value);
    if (isNaN(numericVal)) return;
    const clampedVal = clamp(numericVal);
    setPaddings((prev) => ({ ...prev, [side]: clampedVal }));
  };

  useEffect(() => {
    const { top, right, bottom, left } = paddings;
    const classes = [
      `mt-${suffixes[top]}`,
      `mr-${suffixes[right]}`,
      `mb-${suffixes[bottom]}`,
      `ml-${suffixes[left]}`,
    ].join(' ');

    if (onChange) onChange(classes);
  }, [paddings, onChange]);

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row w-full gap-4">
        <InputField
          label="Top"
          type="number"
          value={paddings.top}
          onChange={(e) => updatePadding('top', e.target.value)}
          placeholder={`0 - ${suffixes.length - 1}`}
          twClasses={['flex flex-col flex-1/4']}
        />
        <InputField
          label="Right"
          type="number"
          value={paddings.right}
          onChange={(e) => updatePadding('right', e.target.value)}
          placeholder={`0 - ${suffixes.length - 1}`}
          twClasses={['flex flex-col flex-1/4']}
        />
        <InputField
          label="Bottom"
          type="number"
          value={paddings.bottom}
          onChange={(e) => updatePadding('bottom', e.target.value)}
          placeholder={`0 - ${suffixes.length - 1}`}
          twClasses={['flex flex-col flex-1/4']}
        />
        <InputField
          label="Left"
          type="number"
          value={paddings.left}
          onChange={(e) => updatePadding('left', e.target.value)}
          placeholder={`0 - ${suffixes.length - 1}`}
          twClasses={['flex flex-col flex-1/4']}
        />
      </div>
    </div>
  );
};

export default PaddingPicker;
