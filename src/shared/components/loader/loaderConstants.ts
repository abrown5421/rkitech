import type { LoaderVariant } from "./loaderTypes";

export const animationDelayMap: Record<
  Exclude<LoaderVariant, "spinner">,
  string[]
> = {
  flash: ["0s", "0.1s", "0.2s"],
  bounce: ["0s", "0.1s", "0.2s"],
  rubberBand: ["0s", "0.25s", "0.5s"],
  heartBeat: ["0s", "0.25s", "0.5s"],
};