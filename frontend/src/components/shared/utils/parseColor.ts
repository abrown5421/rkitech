import type { TailwindColor, ThemeColor } from "../types/commonPropTypes";

export const parseColor = (color: ThemeColor | TailwindColor, type: 'text' | 'bg' | 'border') => {
  if (!color) return '';
  
  const daisyColors = ['primary','secondary','accent','neutral','base-100','base-200','base-300','info','success','warning','error'];
  if (daisyColors.includes(color)) {
    return `${type}-${color}`;
  }
  
  return `${type}-${color}`;
};
