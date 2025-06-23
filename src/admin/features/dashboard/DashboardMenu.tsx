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
    { itemName: 'Pages', icon: 'FileText', itemType: 'Page', itemSlug: '/pages', itemOrder: 1, itemDescription: 'Manage your applications pages' },
    { itemName: 'Page Editor', icon: 'Edit3', itemType: 'Page', itemSlug: '/page-editor', itemOrder: 2, itemDescription: 'Edit page content and visual layout' },
    { itemName: 'Employee Manager', icon: 'Users', itemType: 'Page', itemSlug: '/employee-manager', itemOrder: 3, itemDescription: 'Manage your staff profiles' },
    { itemName: 'Menus', icon: 'List', itemType: 'Page', itemSlug: '/menus', itemOrder: 4, itemDescription: 'Organize and edit site navigation menus' },
    { itemName: 'Forms', icon: 'FormInput', itemType: 'Page', itemSlug: '/forms', itemOrder: 5, itemDescription: 'Create and manage user-facing forms' },
    { itemName: 'Blog', icon: 'Feather', itemType: 'Page', itemSlug: '/blog', itemOrder: 6, itemDescription: 'Publish and manage blog posts' },
    { itemName: 'Gallery', icon: 'Image', itemType: 'Page', itemSlug: '/gallery', itemOrder: 7, itemDescription: 'Upload and organize media galleries' },
    { itemName: 'Collections', icon: 'Layers', itemType: 'Page', itemSlug: '/collections', itemOrder: 8, itemDescription: 'Manage application collections' },
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
          <span className="text-sm">{item.itemDescription}</span>
        </button>
      ))}
    </Container>
  );
};

export default DashboardMenu;
