import React from 'react';
import type { MenuProps } from './menuTypes';
import { useClientNavigationHook } from '../../client/hooks/useClientNavigationHook';
import { useAppSelector } from '../../store/hooks';
import { useAdminNavigationHook } from '../../admin/hooks/useAdminNavigationHook';

const Menu: React.FC<MenuProps> = ({
  menuID,
  menuObject,
  routingID,
  activeClasses =[],
  secondaryClasses =[],
  twClasses = [],
  requirePageMatch = true,
}) => {
  const clientNavigation = useClientNavigationHook();
  const adminNavigation = useAdminNavigationHook();
  const pages = useAppSelector((state) => state.initialApp.pages);
  const activePage = useAppSelector((state) => state.client.activeClientPage)
  const menus = useAppSelector((state) => state.initialApp.menus);

  const matchedMenu = menuObject || menus.find(menu => menu.menuName === menuID);

  let navigate;
  switch (routingID) {
    case 'admin':
      navigate = adminNavigation;
      break;
    case 'client':
    default:
      navigate = clientNavigation;
      break;
  }

  return (
    <div className={`component-root ${twClasses.join(' ')}`}>
      {[...(matchedMenu?.menuItems || [])]
        .sort((a, b) => a.itemOrder - b.itemOrder)
        .map((item, index) => {
          const matchedPage = pages.find(page => page.pageName === item.itemName);

          if (requirePageMatch && matchedPage && matchedPage.pageActive === false) {
            return null;
          }

          const shouldNavigate = !requirePageMatch || matchedPage;

          return (
            <button
              key={index}
              className={`menu-item ${secondaryClasses.join(' ')} ${
                item.itemName === activePage.activeClientPageName
                  ? activeClasses.map(cls => cls.classDefinition).join(' ')
                  : ''
              }`}
              onClick={() =>
                shouldNavigate
                  ? navigate(item.itemSlug, item.itemName, matchedPage?.pageID ?? '')()
                  : console.warn(`No matching page found for slug: ${item.itemSlug}`)
              }
            >
              {item.itemName}
            </button>
          );
        })}
    </div>
  );

};

export default Menu;
