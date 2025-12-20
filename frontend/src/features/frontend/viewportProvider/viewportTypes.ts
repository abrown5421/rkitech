export type Viewport = "mobile" | "tablet" | "desktop";

export const VIEWPORT_ORDER: Viewport[] = ["mobile", "tablet", "desktop"];

export type ViewportContextValue = {
  viewport: Viewport;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  forced: boolean;
};