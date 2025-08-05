import React, { useState } from "react";
import clsx from "clsx";
import type { ImageProps } from "./imageTypes";
import { getAnimationClasses } from "../../../client/utils/useAnimation";

const Image: React.FC<ImageProps> = ({
  src,
  alt = "",
  width,
  height,
  animation,
  TwClassName = "",
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const animationClasses = getAnimationClasses(animation, isHovered);

  const classes = clsx(
    "block", 
    animationClasses,
    TwClassName
  );

  return (
    <img
      src={src}
      alt={alt}
      className={classes}
      style={{
        width: width ? (typeof width === "number" ? `${width}px` : width) : undefined,
        height: height ? (typeof height === "number" ? `${height}px` : height) : undefined,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    />
  );
};

export default Image;
