import React from 'react';
import type { AvatarProps } from './avatarTypes';

const Avatar: React.FC<AvatarProps> = ({
  avatarImage,
  avatarFirstName,
  avatarLastName,
  twClasses = [],
}) => {
  const initials = `${avatarFirstName.charAt(0)}${avatarLastName.charAt(0)}`.toUpperCase();

  return (
    <div className={`component-root w-10 h-10 rounded-full flex items-center justify-center text-white bg-gray-900 text-sm font-medium${twClasses.join(' ')}`}>
      {avatarImage ? (
        <img
          src={avatarImage}
          alt={`${avatarFirstName} ${avatarLastName}`}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};

export default Avatar;
