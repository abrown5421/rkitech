import React from 'react';
import * as Icons from 'lucide-react';
import type { LucideProps } from 'lucide-react';

type IconComponent = React.FC<LucideProps>;

type IconName = {
  [K in keyof typeof Icons]: typeof Icons[K] extends IconComponent ? K : never;
}[keyof typeof Icons];

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
}

const Icon: React.FC<IconProps> = ({ name, size = 24, color = 'currentColor' }) => {
  const LucideIcon = Icons[name] as IconComponent;

  if (!LucideIcon) {
    return <span style={{ color: 'red' }}>Icon "{name}" not found</span>;
  }

  return <LucideIcon size={size} color={color} />;
};

export default Icon;
