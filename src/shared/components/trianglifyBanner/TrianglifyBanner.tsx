import React, { useEffect, useRef } from "react";
import trianglify from "trianglify";
import type { TrianglifyBannerProps } from "./trianglifyBannerTypes";

const TrianglifyBanner: React.FC<TrianglifyBannerProps> = ({
  xColors,
  yColors,
  width,
  height,
  variance = 0.75,
  cellSize = 75,
  auxImage,
  TwClassName = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!auxImage && containerRef.current) {
      const numericWidth =
        typeof width === "number" ? width : containerRef.current.clientWidth;
      const numericHeight =
        typeof height === "number" ? height : containerRef.current.clientHeight;

      const pattern = trianglify({
        width: numericWidth,
        height: numericHeight,
        cell_size: cellSize,
        variance,
        x_colors: xColors,
        y_colors: yColors,
      });

      const svg = pattern.svg()
      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(svg);
    }
  }, [xColors, yColors, width, height, variance, cellSize, auxImage]);

  const wrapperStyles =
    typeof width === "number" || typeof height === "number"
      ? {
          width: typeof width === "number" ? `${width}px` : undefined,
          height: typeof height === "number" ? `${height}px` : undefined,
        }
      : undefined;

  return (
    <>
      {auxImage ? (
        <img
          src={auxImage}
          alt="Auxiliary Banner"
          className={`w-full object-cover ${
            typeof height === "string" ? height : ""
          }`}
          style={wrapperStyles}
        />
      ) : (
        <div
          ref={containerRef}
          className={`overflow-hidden relative ${typeof width === "string" ? width : ""} ${
            typeof height === "string" ? height : ""
          } ${TwClassName}`}
          style={wrapperStyles}
        />
      )}
      
        
    </>
  );
};

export default TrianglifyBanner;