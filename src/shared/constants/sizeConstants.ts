import type { SizeValue } from "../types/sizeTypes";

export const resolveDimension = (value?: SizeValue, axis: 'width' | 'height' = 'width') => {
  if (!value) return undefined;
  if (typeof value === 'number') return { [axis]: `${value}px` };
  if (value.startsWith('w-') || value.startsWith('h-')) return value; 
  return { [axis]: value }; 
};