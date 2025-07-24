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
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!auxImage && canvasRef.current) {
      const numericWidth =
        typeof width === "number" ? width : canvasRef.current.clientWidth;
      const numericHeight =
        typeof height === "number" ? height : canvasRef.current.clientHeight;

      const pattern = trianglify({
        width: numericWidth,
        height: numericHeight,
        cell_size: cellSize,
        variance,
        x_colors: xColors,
        y_colors: yColors,
      });

      pattern.toCanvas(canvasRef.current);
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
      className={`overflow-hidden relative ${typeof width === "string" ? width : ""} ${
        typeof height === "string" ? height : ""
      } ${className}`}
      style={wrapperStyles}
    >
      {auxImage ? (
        <img
          src={auxImage}
          alt="Auxiliary Banner"
          className="w-full h-full object-cover"
        />
      ) : (
        <canvas ref={canvasRef} className="w-full h-full" />
      )}
    </div>
  );
};

export default TrianglifyBanner;
