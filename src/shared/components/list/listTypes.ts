import type { AnimationProps } from "../../types/animationTypes";

export interface ListItem {
  text: string;
  subText?: string;
}

export interface ListProps {
  list: ListItem[];
  listType: 'ordered' | 'unordered'
  animation?: AnimationProps;
  TwClassName?: string;
}
