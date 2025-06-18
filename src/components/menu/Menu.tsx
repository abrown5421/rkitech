import React, { useEffect } from 'react';
import type { MenuProps } from './menuTypes';
import { useClientNavigationHook } from '../../client/hooks/useClientNavigationHook';
import { useAppSelector } from '../../store/hooks';

const Menu: React.FC<MenuProps> = ({
  menuID,
  routingID,
  activeClasses =[],
  secondaryClasses =[],
  twClasses = []
}) => {
  const clientNavigation = useClientNavigationHook();
  const pages = useAppSelector((state) => state.initialApp.pages);
  const activePage = useAppSelector((state) => state.client.activeClientPage)
  const menus = useAppSelector((state) => state.initialApp.menus);
  useEffect(()=>{console.log(activeClasses)}, [activeClasses])
  const matchedMenu = menus.find(menu => menu.menuName === menuID);

  let navigate;
  switch (routingID) {
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
          
          return (
            <button
              key={index}
              className={`menu-item ${secondaryClasses.join(' ')} ${
                item.itemName === activePage.activeClientPageName
                  ? activeClasses.map(cls => cls.classDefinition).join(' ')
                  : ''
              }`}
              onClick={() =>
                matchedPage
                  ? navigate(item.itemSlug, item.itemName, matchedPage.pageID)()
                  : console.warn(`No matching page found for slug: ${item.itemSlug}`)
              }
            >
              {item.itemName}
            </button>
          );
        }) || <p>No menu found.</p>}
    </div>
  );
};

export default Menu;
