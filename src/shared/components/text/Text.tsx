import React from 'react';
import clsx from 'clsx';
import type { TextProps } from './textTypes';
import { fontMap, sizeMap } from './textConstants';
import { marginMap, paddingMap } from '../../constants/spacingConstants';

const Text: React.FC<TextProps> = ({
  text,
  size = 'md',
  bold = false,
  italic = false,
  underline = false,
  font = 'sans',
  color = 'text-gray-900',
  padding = 'none',
  margin = 'none',
  className = '',
}) => {
  const classes = clsx(
    sizeMap[size],
    bold && 'font-bold',
    italic && 'italic',
    underline && 'underline',
    fontMap[font],
    color,
    paddingMap[padding],
    marginMap[margin],
    className
  );

  return <div className={classes}>{text}</div>;
};

export default Text;
