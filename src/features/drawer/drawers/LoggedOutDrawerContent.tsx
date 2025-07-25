import React from 'react';
import Container from '../../../shared/components/container/Container';
import Text from '../../../shared/components/text/Text';
import Button from '../../../shared/components/button/Button';
import { useAppSelector } from '../../../app/hooks';
import { useNavigationHook } from '../../../hooks/useNavigationHook';
import Loader from '../../../shared/components/loader/Loader';

const LoggedOutDrawerContent: React.FC = () => {
  const clientNavigation = useNavigationHook();
  const menus = useAppSelector((state) => state.menus);
  const pages = useAppSelector((state) => state.pages.pages);
  const activePage = useAppSelector((state) => state.pageShell.activePageShellName);
  const { loading, id } = useAppSelector((state) => state.loading);
  const isLoading = loading && id === 'logoutButton';
  const isLoginHidden = activePage === 'Auth';

  const primaryMenu = menus.menus.find((menu) => menu.menuName === 'Primary Menu');

  const renderMenuItems = (menuItems: any[]) =>
    menuItems
      ?.slice()
      .sort((a, b) => a.itemOrder - b.itemOrder)
      .map((menuItem) => {
        if (menuItem.itemType === 'page') {
          const page = pages.find((p) => p.pageID === menuItem.itemId);
          if (!page) return null;
          return (
            <Button
              key={menuItem.itemId}
              className="pt-3 pr-0 pb-3 pl-0"
              variant="ghost"
              cursor="pointer"
              color={activePage === menuItem.itemName ? 'primary' : 'black'}
              onClick={() => {
                setTimeout(() => {
                  clientNavigation(page.pagePath, page.pageName, page.pageID)();
                }, 250);
              }}
            >
              {menuItem.itemName}
            </Button>
          );
        } else {
          return (
            <Button
              key={menuItem.itemName}
              className="pt-3 pr-0 pb-3 pl-0"
              variant="ghost"
              cursor="pointer"
              color="black"
              onClick={() => window.open(menuItem.itemLink, '_blank')}
            >
              {menuItem.itemName}
            </Button>
          );
        }
      });

  return (
    <Container flexDirection="col" height="h-full" width="w-full" justifyContent="between">
      <Container flexDirection="col" height="h-full" width="w-full" alignItems="start">
        {renderMenuItems(primaryMenu?.menuItems || [])}
      </Container>

      <Button
        width="w-full"
        padding="sm"
        color="primary"
        cursor="pointer"
        onClick={() => clientNavigation('/login', 'Auth', 'authenticationPage')()}
        animation={{
        entranceExit: {
          entranceAnimation: 'animate__fadeIn',
          exitAnimation: 'animate__fadeOut',
          isEntering: !isLoginHidden,
        },
      }}
      >
        {isLoading ? <Loader variant="spinner" color="bg-white" /> : <Text text="Login" color="white" />}
      </Button>
    </Container>
  );
};

export default LoggedOutDrawerContent;
