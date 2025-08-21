import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import Container from '../../../shared/components/container/Container';
import Input from '../../../shared/components/input/Input';
import Text from '../../../shared/components/text/Text';
import type { MarginPickerProps } from './marginPickerTypes';

const MarginPicker: React.FC<MarginPickerProps> = ({ 
  label = '', 
  value = "", 
  onChange, 
  TwClassName = '' 
}) => {
  const classString = Array.isArray(TwClassName) ? TwClassName.join(' ') : TwClassName || '';
  
  const [marginTop, setMarginTop] = useState<number>(0);
  const [marginRight, setMarginRight] = useState<number>(0);
  const [marginBottom, setMarginBottom] = useState<number>(0);
  const [marginLeft, setMarginLeft] = useState<number>(0);
  
  useEffect(() => {
    if (!value) {
      setMarginTop(0);
      setMarginRight(0);
      setMarginBottom(0);
      setMarginLeft(0);
      return;
    }

    const classes = value.split(' ').filter(Boolean);
    
    const mtClass = classes.find(cls => /^mt-\d+$/.test(cls));
    const mrClass = classes.find(cls => /^mr-\d+$/.test(cls));
    const mbClass = classes.find(cls => /^mb-\d+$/.test(cls));
    const mlClass = classes.find(cls => /^ml-\d+$/.test(cls));
  

    setMarginTop(mtClass ? parseInt(mtClass.replace('mt-', '')) : 0);
    setMarginRight(mrClass ? parseInt(mrClass.replace('mr-', '')) : 0);
    setMarginBottom(mbClass ? parseInt(mbClass.replace('mb-', '')) : 0);
    setMarginLeft(mlClass ? parseInt(mlClass.replace('ml-', '')) : 0);
  }, [value]);

  const buildMarginClass = (
    newMarginTop?: number,
    newMarginRight?: number, 
    newMarginBottom?: number,
    newMarginLeft?: number,
  ) => {
    const mt = newMarginTop !== undefined ? newMarginTop : marginTop;
    const mr = newMarginRight !== undefined ? newMarginRight : marginRight;
    const mb = newMarginBottom !== undefined ? newMarginBottom : marginBottom;
    const ml = newMarginLeft !== undefined ? newMarginLeft : marginLeft;

    const classes: string[] = [];

    if (mt > 0) classes.push(`mt-${mt}`);
    if (mr > 0) classes.push(`mr-${mr}`);
    if (mb > 0) classes.push(`mb-${mb}`);
    if (ml > 0) classes.push(`ml-${ml}`);

    return classes.join(' ');
  };

  const handleMarginChange = (side: 'top' | 'right' | 'bottom' | 'left', newValue: number) => {
    const updates: Record<string, number> = {};
    updates[`newMargin${side.charAt(0).toUpperCase() + side.slice(1)}`] = newValue;
    
    switch (side) {
      case 'top':
        setMarginTop(newValue);
        break;
      case 'right':
        setMarginRight(newValue);
        break;
      case 'bottom':
        setMarginBottom(newValue);
        break;
      case 'left':
        setMarginLeft(newValue);
        break;
    }

    const spacingClass = buildMarginClass(
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
            value={marginTop.toString()}
            onChange={(e) => {
              const newValue = parseInt(e.target.value) || 0;
              handleMarginChange('top', newValue);
            }}
          />
          <Input
            TwClassName="flex-1"
            type="number"
            min={0}
            max={96}
            step={1}
            label="Right"
            value={marginRight.toString()}
            onChange={(e) => {
              const newValue = parseInt(e.target.value) || 0;
              handleMarginChange('right', newValue);
            }}
          />
          <Input
            TwClassName="flex-1"
            type="number"
            min={0}
            max={96}
            step={1}
            label="Bottom"
            value={marginBottom.toString()}
            onChange={(e) => {
              const newValue = parseInt(e.target.value) || 0;
              handleMarginChange('bottom', newValue);
            }}
          />
          <Input
            TwClassName="flex-1"
            type="number"
            min={0}
            max={96}
            step={1}
            label="Left"
            value={marginLeft.toString()}
            onChange={(e) => {
              const newValue = parseInt(e.target.value) || 0;
              handleMarginChange('left', newValue);
            }}
          />
        </Container>
      </Container>
   );
};

export default MarginPicker;