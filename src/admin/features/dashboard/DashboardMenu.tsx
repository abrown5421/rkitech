import React from 'react';
import { useAppSelector } from '../../../store/hooks';
import type { AnimationObject } from '../../../components/container/containerTypes';
import Container from '../../../components/container/Container';
import { useAdminNavigationHook } from '../../hooks/useAdminNavigationHook';
import Icon from '../../../components/Icon/Icon';
import type { DashboardItem } from './dashboardTypes';


const DashboardMenu: React.FC = () => {
  const adminNavigation = useAdminNavigationHook();
  const activeAdminPage = useAppSelector((state) => state.admin.activeAdminPage);

  const containerAnimations: AnimationObject = {
    entranceAnimation: 'animate__fadeIn',
    exitAnimation: 'animate__fadeOut',
    isEntering: activeAdminPage.activeAdminPageIn,
  };

  const DashboardItems: DashboardItem[] = [
    { itemName: 'Pages', icon: 'FileText', itemType: 'Page', itemSlug: '/pages', itemOrder: 1 },
    { itemName: 'Page Editor', icon: 'Edit3', itemType: 'Page', itemSlug: '/page-editor', itemOrder: 2 },
  ];

  return (
    <Container animationObject={containerAnimations} twClasses={["flex flex-col gap-4 bg-gray-50"]}>
      {DashboardItems.map((item) => (
        <button
          key={item.itemSlug}
          onClick={adminNavigation(item.itemSlug, item.itemName)}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded shadow hover:bg-gray-100 transition"
        >
          <Icon name={item.icon} size={20} />
          <span className="text-lg font-medium">{item.itemName}:</span>
        </button>
      ))}
    </Container>
  );
};

export default DashboardMenu;
