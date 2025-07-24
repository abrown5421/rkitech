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
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!auxImage && containerRef.current) {
      const numericWidth =
        typeof width === "number" ? width : containerRef.current.clientWidth;
      const numericHeight =
        typeof height === "number" ? height : containerRef.current.clientHeight;

      const svg = trianglify({
        width: numericWidth,
        height: numericHeight,
        cell_size: cellSize,
        variance,
        x_colors: xColors,
        y_colors: yColors,
      }).toSVG(); 

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
    <div
      ref={containerRef}
      className={`overflow-hidden relative ${typeof width === "string" ? width : ""} ${
        typeof height === "string" ? height : ""
      } ${className}`}
      style={wrapperStyles}
    >
      {auxImage && (
        <img
          src={auxImage}
          alt="Auxiliary Banner"
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
};

export default TrianglifyBanner;
