import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import Container from '../../../shared/components/container/Container';
import Input from '../../../shared/components/input/Input';
import Text from '../../../shared/components/text/Text';
import type { PaddingPickerProps } from './paddingPickerTypes';

const PaddingPicker: React.FC<PaddingPickerProps> = ({ 
  label = '', 
  value = "", 
  onChange, 
  TwClassName = '' 
}) => {
  const classString = Array.isArray(TwClassName) ? TwClassName.join(' ') : TwClassName || '';
  
  const [paddingTop, setPaddingTop] = useState<number>(0);
  const [paddingRight, setPaddingRight] = useState<number>(0);
  const [paddingBottom, setPaddingBottom] = useState<number>(0);
  const [paddingLeft, setPaddingLeft] = useState<number>(0);
  
  useEffect(() => {
    if (!value) {
      setPaddingTop(0);
      setPaddingRight(0);
      setPaddingBottom(0);
      setPaddingLeft(0);
      return;
    }

    const classes = value.split(' ').filter(Boolean);
    
    const ptClass = classes.find(cls => /^pt-\d+$/.test(cls));
    const prClass = classes.find(cls => /^pr-\d+$/.test(cls));
    const pbClass = classes.find(cls => /^pb-\d+$/.test(cls));
    const plClass = classes.find(cls => /^pl-\d+$/.test(cls));
  

    setPaddingTop(ptClass ? parseInt(ptClass.replace('pt-', '')) : 0);
    setPaddingRight(prClass ? parseInt(prClass.replace('pr-', '')) : 0);
    setPaddingBottom(pbClass ? parseInt(pbClass.replace('pb-', '')) : 0);
    setPaddingLeft(plClass ? parseInt(plClass.replace('pl-', '')) : 0);
  }, [value]);

  const buildPaddingClass = (
    newPaddingTop?: number,
    newPaddingRight?: number, 
    newPaddingBottom?: number,
    newPaddingLeft?: number,
  ) => {
    const pt = newPaddingTop !== undefined ? newPaddingTop : paddingTop;
    const pr = newPaddingRight !== undefined ? newPaddingRight : paddingRight;
    const pb = newPaddingBottom !== undefined ? newPaddingBottom : paddingBottom;
    const pl = newPaddingLeft !== undefined ? newPaddingLeft : paddingLeft;

    const classes: string[] = [];

    if (pt > 0) classes.push(`pt-${pt}`);
    if (pr > 0) classes.push(`pr-${pr}`);
    if (pb > 0) classes.push(`pb-${pb}`);
    if (pl > 0) classes.push(`pl-${pl}`);

    return classes.join(' ');
  };

  const handlePaddingChange = (side: 'top' | 'right' | 'bottom' | 'left', newValue: number) => {
    const updates: Record<string, number> = {};
    updates[`newPadding${side.charAt(0).toUpperCase() + side.slice(1)}`] = newValue;
    
    switch (side) {
      case 'top':
        setPaddingTop(newValue);
        break;
      case 'right':
        setPaddingRight(newValue);
        break;
      case 'bottom':
        setPaddingBottom(newValue);
        break;
      case 'left':
        setPaddingLeft(newValue);
        break;
    }

    const spacingClass = buildPaddingClass(
      side === 'top' ? newValue : undefined,
      side === 'right' ? newValue : undefined,
      side === 'bottom' ? newValue : undefined,
      side === 'left' ? newValue : undefined
    );
    onChange?.(spacingClass);
  };

  return (
    <Container TwClassName={clsx('flex-col', classString)}>
      {label && <Text TwClassName="block text-sm font-medium mb-4" text={label} />}
        <Container TwClassName='flex-row gap-2'>
          <Input
            TwClassName="flex-1"
            type="number"
            min={0}
            max={96}
            step={1}
            label="Top"
            value={paddingTop.toString()}
            onChange={(e) => {
              const newValue = parseInt(e.target.value) || 0;
              handlePaddingChange('top', newValue);
            }}
          />
          <Input
            TwClassName="flex-1"
            type="number"
            min={0}
            max={96}
            step={1}
            label="Right"
            value={paddingRight.toString()}
            onChange={(e) => {
              const newValue = parseInt(e.target.value) || 0;
              handlePaddingChange('right', newValue);
            }}
          />
          <Input
            TwClassName="flex-1"
            type="number"
            min={0}
            max={96}
            step={1}
            label="Bottom"
            value={paddingBottom.toString()}
            onChange={(e) => {
              const newValue = parseInt(e.target.value) || 0;
              handlePaddingChange('bottom', newValue);
            }}
          />
          <Input
            TwClassName="flex-1"
            type="number"
            min={0}
            max={96}
            step={1}
            label="Left"
            value={paddingLeft.toString()}
            onChange={(e) => {
              const newValue = parseInt(e.target.value) || 0;
              handlePaddingChange('left', newValue);
            }}
          />
        </Container>
      </Container>
   );
};

export default PaddingPicker;