import React from "react";
import Avatar from "./Avatar";
import type { AvatarGroupProps } from "./avatarTypes";

const AvatarGroup: React.FC<AvatarGroupProps> = ({
  avatars,
  maxDisplay = 3,
  counterClass = "bg-primary text-white text-xs",
  sizeClass = "w-10 h-10",
  spacingClass = "-space-x-2",
  className = "",
  animationObject,
  style
}) => {
  const displayAvatars = avatars.slice(0, maxDisplay);
  const remaining = avatars.length - maxDisplay;

  return (
    <div className={`flex items-center ${spacingClass} ${className}`} style={style}>
      {displayAvatars.map((avatar, i) => (
        <Avatar
          key={i}
          {...avatar}
          sizeClass={avatar.sizeClass || sizeClass}
          animationObject={animationObject}
          borderClass={avatar.borderClass}
          bgColorClass={avatar.bgColorClass}
        />
      ))}

      {remaining > 0 && (
        <div className={`flex items-center justify-center ${sizeClass} rounded-full ${counterClass}`}>
          +{remaining}
        </div>
      )}
    </div>
  );
};

export default AvatarGroup;
