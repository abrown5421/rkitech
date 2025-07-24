
export type TrianglifyBannerProps = {
  xColors: [string, string]; // Two colors for X-axis
  yColors: [string, string]; // Two colors for Y-axis
  width: number | string; // px or Tailwind class
  height: number | string; // px or Tailwind class
  variance?: number; // Optional, default 0.75
  cellSize?: number; // Optional, default 75
  auxImage?: string; // Fallback image URL
  className?: string; // Additional classes for wrapper
};