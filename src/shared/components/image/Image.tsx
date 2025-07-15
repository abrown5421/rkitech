import React, { useState } from "react";
import clsx from "clsx";
import type { ImageProps } from "./imageTypes";
import { objectFitMap } from "./imageConstants";
import { marginMap, paddingMap } from "../../constants/spacingConstants";
import { getAnimationClasses } from "../../utils/useAnimation";

const Image: React.FC<ImageProps> = ({
  src,
  alt = "",
  width,
  height,
  objectFit = "cover",
  padding = "none",
  margin = "none",
  animation,
  className = "",
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const animationClasses = getAnimationClasses(animation, isHovered);

  const classes = clsx(
    "block", 
    objectFitMap[objectFit],
    animationClasses,
    paddingMap[padding],
    marginMap[margin],
    className
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
