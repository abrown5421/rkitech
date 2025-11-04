import type { AnimationObject } from "../shared/types/animationTypes";

export interface ItemColor {
  bgColorClass: string;
  headingTextClass: string;
  bodyTextClass: string;
  borderClass: string;
}

export interface AccordionItem {
  id: string | number;
  title: string;
  content: React.ReactNode;
  defaultOpen?: boolean;
  activeColorObject: ItemColor;
  inactiveColorObject: ItemColor
}

export interface AccordionProps {
  items: AccordionItem[];
  className?: string;
  toggleable?: boolean; 
  allowMultipleOpen?: boolean; 
  namePrefix?: string;
  animationObject?: AnimationObject;
  style?: React.CSSProperties;
}