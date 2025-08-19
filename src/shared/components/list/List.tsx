import React, { useState } from 'react';
import type { ListProps } from './listTypes';
import { getAnimationClasses } from '../../../client/utils/useAnimation';
import clsx from 'clsx';

const List: React.FC<ListProps> = ({
  list,
  listType,
  animation,
  TwClassName = '',
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const animationClasses = getAnimationClasses(animation, isHovered);
  const classString = Array.isArray(TwClassName) ? TwClassName.join(' ') : TwClassName || '';
  
  const classes = clsx(
    animationClasses,
    classString,
    'ml-9'
  );

  return (
    <div 
      className={classes}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ul className={listType === 'ordered' ? 'list-decimal' : 'list-disc'}>
        {list.map((item, index) => (
          <li
            key={index}
            {...(animation ? { 'data-animation': JSON.stringify(animation) } : {})}
          >
            <div className='flex flex-col'>
                <span className="font-semibold">{item.text}</span>
                {item.subText && <span className="text-gray-500 text-sm">{item.subText}</span>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default List;
