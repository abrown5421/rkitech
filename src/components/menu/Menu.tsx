import React, { useEffect, useState } from 'react';
import type { MenuProps } from './menuTypes';
import { useClientNavigationHook } from '../../client/hooks/useClientNavigationHook';
import { useAppSelector } from '../../store/hooks';
import { useAdminNavigationHook } from '../../admin/hooks/useAdminNavigationHook';
import { getDocumentById } from '../../services/database/readData';

const Menu: React.FC<MenuProps> = ({
  menuID,
  routingID,
  menuObject,
  activeClasses = [],
  secondaryClasses = [],
  twClasses = [],
  requirePageMatch = true,
}) => {
  const clientNavigation = useClientNavigationHook();
  const adminNavigation = useAdminNavigationHook();
  const menus = useAppSelector((state) => state.initialApp.menus);
  const activePage = useAppSelector((state) => state.client.activeClientPage);

  const [menuData, setMenuData] = useState<Record<string, any>>({});

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

  const isManualMenu = !!menuObject?.menuItems?.length;
  const rawMenuItems = isManualMenu
    ? menuObject.menuItems
    : menus.find((menu) => menu.menuName === menuID)?.menuItems ?? [];

  const menuItems = [...rawMenuItems].sort((a, b) => a.itemOrder - b.itemOrder);

  useEffect(() => {
    const fetchMenuData = async () => {
      if (isManualMenu) {
        return;
      }

      const entries = await Promise.all(
        menuItems.map(async (item) => {
          const data = await getDocumentById('Pages', item.itemPageId);
          return [item.itemPageId, data];
        })
      );

      setMenuData(Object.fromEntries(entries));
    };

    fetchMenuData();
  }, [isManualMenu, menuItems]);

  return (
    <div className={`component-root ${twClasses.join(' ')}`}>
      {menuItems.map((item) => {
        const pageData = isManualMenu
          ? { pageSlug: item.itemSlug, pageName: item.itemName, pageActive: true }
          : menuData[item.itemPageId];

        if (pageData?.pageActive === false) {
          return null;
        }

        const isActive =
          !requirePageMatch ||
          pageData?.pageName === activePage?.activeClientPageName;

        return (
          <div
            key={item.itemPageId ?? item.itemSlug}
            className={`menu-item ${secondaryClasses.join(' ')} ${
              isActive
                ? activeClasses.map((cls) => cls.classDefinition).join(' ')
                : ''
            }`}
            onClick={() =>
              navigate(
                pageData?.pageSlug ?? '',
                pageData?.pageName ?? '',
                item.itemPageId ?? ''
              )()
            }
          >
            {pageData?.pageName ?? item.itemName}
          </div>
        );
      })}
    </div>
  );
};

export default Menu;