import React from "react";
import type { AvatarProps } from "./avatarTypes";

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "Avatar",
  sizeClass = "w-12 h-12",
  shape = "circle",
  placeholder,
  showIndicator = false,
  indicatorClass = "status-success",
  borderClass = "border-2 border-secondary",
  bgColorClass = "bg-base-200",
  textColorClass = "text-base-content",
  className = "",
  animationObject,
  style,
  onClick
}) => {
  const animationClasses = animationObject
    ? `animate__animated ${animationObject.isEntering ? animationObject.entranceAnimation : animationObject.exitAnimation}`
    : "";

  const shapeClass = shape === "circle" ? "rounded-full" : "rounded-lg";

  return (
    <div
      className={`relative inline-block ${sizeClass} ${shapeClass} ${borderClass} ${animationClasses} ${className}`}
      style={{ animationDelay: `${animationObject?.delay ?? 0}s`, ...style }}
      onClick={onClick}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className={`object-cover w-full h-full ${shapeClass}`}
        />
      ) : (
        <div
          className={`flex items-center justify-center w-full h-full ${shapeClass} ${bgColorClass} ${textColorClass}`}
        >
          {placeholder || <span className="text-sm">{alt[0]}</span>}
        </div>
      )}

      {showIndicator && (
        <span
          className={`indicator absolute bottom-0 right-0 w-3 h-3 rounded-full ${indicatorClass} border-4 border-white`}
        />
      )}
    </div>
  );
};


export default Avatar;
