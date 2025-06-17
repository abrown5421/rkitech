import React from 'react';
import type { MenuProps } from './menuTypes';

const Menu: React.FC<MenuProps> = ({ twClasses = [], pages, activePageName, onNavigate }) => {
  return (
    <div className={`component-root flex space-x-4 items-center p-4 ${twClasses.join(' ')}`}>
      {pages.map((page) => (
        <div
          key={page.pageID}
          role="button"
          tabIndex={0}
          onClick={() => onNavigate(page.menuConfigs.pageSlug, page.pageName, page.pageID)}
          onKeyDown={(e) =>
            e.key === 'Enter' && onNavigate(page.menuConfigs.pageSlug, page.pageName, page.pageID)
          }
          className={`font-mono cursor-pointer hover:text-amber-500 ${
            page.pageName === activePageName ? 'text-amber-500 font-bold' : 'text-gray-900'
          }`}
        >
          {page.pageName}
        </div>
      ))}
    </div>
  );
};

export default Menu;
