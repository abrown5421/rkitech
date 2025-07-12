import React from 'react';
import clsx from 'clsx';
import type { TextProps } from './textTypes';
import { fontMap, sizeMap } from './textConstants';

const Text: React.FC<TextProps> = ({
  text,
  size,
  bold = false,
  italic = false,
  underline = false,
  font = 'sans',
  color = 'text-gray-900',
  className = '',
}) => {
  const classes = clsx(
    sizeMap[size],
    bold && 'font-bold',
    italic && 'italic',
    underline && 'underline',
    fontMap[font],
    color,
    className
  );

  return <div className={classes}>{text}</div>;
};

export default Text;
