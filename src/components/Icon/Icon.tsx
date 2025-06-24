import React from 'react';
import * as Icons from 'lucide-react';
import type { IconComponent, IconProps } from './iconTypes';
import { tailwindToHex } from '../../utils/tailwindToHex/tailwindToHex';

const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  colorName,
  colorIntensity = 400,
}) => {

  const LucideIcon = Icons[name] as IconComponent; 

  if (!LucideIcon) {
    return <span style={{ color: 'red' }}>Icon "{name}" not found</span>;
  }

  const resolvedColor = (colorName ? tailwindToHex(colorName, colorIntensity) : 'currentColor');

  return <LucideIcon size={size} color={resolvedColor} />;
};

export default Icon;
