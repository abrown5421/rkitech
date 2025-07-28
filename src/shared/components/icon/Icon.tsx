import React, { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import clsx from 'clsx';
import { getAnimationClasses } from '../../utils/useAnimation';
import type { IconProps } from './iconTypes';

const Icon: React.FC<IconProps> = ({
  name,
  cursor,
  animation,
  TwClassName,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const ImportedIcon = LucideIcons[name] as React.FC<LucideProps> | undefined;

  if (!ImportedIcon) {
    console.warn(`Lucide icon "${name}" not found.`);
    return null;
  }

  const animationClasses = getAnimationClasses(animation, isHovered);

  const classes = clsx(
    animationClasses,
    `cursor-${cursor || 'pointer'}`,
    TwClassName
  );

  return (
    <div
      onClick={onClick}
      className={classes}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ImportedIcon />
    </div>
  );
};

export default Icon;
