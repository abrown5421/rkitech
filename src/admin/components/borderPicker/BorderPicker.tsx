import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import Container from '../../../shared/components/container/Container';
import ColorPicker from '../colorPicker/ColorPicker';
import Select from '../../../shared/components/select/Select';
import Input from '../../../shared/components/input/Input';
import type { BorderPickerProps } from './borderPickerTypes';
import Text from '../../../shared/components/text/Text';

const BorderPicker: React.FC<BorderPickerProps> = ({ 
  label = 'Border Settings', 
  value = "", 
  onChange, 
  TwClassName = '' 
}) => {
  const classString = Array.isArray(TwClassName) ? TwClassName.join(' ') : TwClassName || '';
  
  const [width, setWidth] = useState<number>(0);
  const [style, setStyle] = useState<string>('');
  const [color, setColor] = useState<string>('');

  useEffect(() => {
    if (!value) {
      setWidth(0);
      setStyle('');
      setColor('');
      return;
    }

    const classes = value.split(' ').filter(Boolean);
    
    const widthClass = classes.find(cls => /^border-\d+$/.test(cls));
    if (widthClass) {
      const widthValue = parseInt(widthClass.replace('border-', ''));
      setWidth(widthValue);
    } else if (classes.includes('border')) {
      setWidth(1); 
    } else {
      setWidth(0);
    }

    const styleClass = classes.find(cls => 
      ['border-none', 'border-solid', 'border-dashed', 'border-dotted', 'border-double'].includes(cls)
    );
    setStyle(styleClass || '');

    const colorClass = classes.find(cls => /^border-\w+-\d+/.test(cls) || cls === 'border-transparent');
    setColor(colorClass || '');
  }, [value]);

  const buildBorderClass = (newWidth?: number, newStyle?: string, newColor?: string) => {
    const w = newWidth !== undefined ? newWidth : width;
    const s = newStyle !== undefined ? newStyle : style;
    const c = newColor !== undefined ? newColor : color;

    const classes: string[] = [];

    if (w === 0) {
      classes.push('border-0');
    } else {
      classes.push(`border-${w}`);
    }

    if (s && s !== 'border-none' && w > 0) {
      classes.push(s);
    }

    if (c && w > 0) {
      classes.push(c);
    }

    return classes.join(' ');
  };

  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth);
    const borderClass = buildBorderClass(newWidth);
    onChange?.(borderClass);
  };

  const handleStyleChange = (newStyle: string) => {
    setStyle(newStyle);
    const borderClass = buildBorderClass(undefined, newStyle);
    onChange?.(borderClass);
  };

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    const borderClass = buildBorderClass(undefined, undefined, newColor);
    onChange?.(borderClass);
  };

  return (
    <Container TwClassName={clsx('flex-col', classString)}>
      {label && <Text TwClassName="block text-sm font-medium mb-2" text={label} />}
      <Container TwClassName='flex-row gap-4 mb-4'>
        <Input
          TwClassName="flex-1"
          type="number"
          min={0}
          max={100}
          step={1}
          label="Width"
          value={width.toString()}
          onChange={(e) => {
            const newWidth = parseInt(e.target.value) || 0;
            handleWidthChange(newWidth);
          }}
        />

        <Select
          TwClassName="flex-3"
          label="Style"
          value={style}
          onChange={(e) => handleStyleChange(e.target.value)}
          disabled={width === 0}
        >
          <option value="">Default</option>
          <option value="border-solid">Solid</option>
          <option value="border-dashed">Dashed</option>
          <option value="border-dotted">Dotted</option>
          <option value="border-double">Double</option>
        </Select>

      </Container>
      <ColorPicker
        label="Border Color"
        prefix="border-"
        TwClassName="flex-3"
        value={color}
        onChange={handleColorChange}
      />
    </Container>
  );
};

export default BorderPicker;