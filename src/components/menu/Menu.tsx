import React from 'react';
import type { MenuProps } from './menuTypes';
import { useAppSelector } from '../../store/hooks';
import { useClientNavigationHook } from '../../client/hooks/useClientNavigationHook';

const Menu: React.FC<MenuProps> = ({
  twClasses = [],
  environment,
  navigationHook,
  menuPages,
}) => {
  const app = useAppSelector((state) => state.initialApp);
  const activePage = useAppSelector((state) => state.client.activeClientPage);

  const useClientNavigation = useClientNavigationHook();

  const navFn =
    environment === 'client'
      ? useClientNavigation
      : navigationHook ?? (() => () => {});

  const pagesToRender =
    environment === 'client'
      ? app.pages
          .filter((page) => page.menuConfigs?.primaryMenu?.show)
          .sort(
            (a, b) =>
              (a.menuConfigs.primaryMenu.order ?? 0) -
              (b.menuConfigs.primaryMenu.order ?? 0)
          )
      : menuPages ?? [];

  return (
    <div className={`component-root flex space-x-4 items-center p-4 ${twClasses.join(' ')}`}>
      {pagesToRender.map((page) => (
        <div
          key={page.pageID}
          role="button"
          tabIndex={0}
          onClick={navFn(page.menuConfigs.pageSlug, page.pageName, page.pageID)}
          onKeyDown={(e) =>
            e.key === 'Enter' && navFn(page.menuConfigs.pageSlug, page.pageName, page.pageID)()
          }
          className={`font-mono cursor-pointer hover:text-amber-500 ${
            page.pageName === activePage.activeClientPageName
              ? 'text-amber-500 font-bold'
              : 'text-gray-900'
          }`}
        >
          {page.pageName}
        </div>
      ))}
    </div>
  );
};

export default Menu;
