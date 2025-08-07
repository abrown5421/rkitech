import React from 'react';
import { useNavigationHook } from '../../../../hooks/useNavigationHook';
import { useAppSelector } from '../../../../app/hooks';
import Button from '../../../../shared/components/button/Button';
import Container from '../../../../shared/components/container/Container';
import Loader from '../../../../shared/components/loader/Loader';
import Text from '../../../../shared/components/text/Text';

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
          if (!page || !page.pageActive) return null;
          return (
            <Button
              key={menuItem.itemId}
              TwClassName={`pt-3 pr-0 pb-3 pl-0 ${activePage === menuItem.itemName ? 'text-primary' : 'text-black'} hover:text-primary`}
              cursor="pointer"
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
              TwClassName={`pt-3 pr-0 pb-3 pl-0 text-black hover:text-primary`}
              cursor="pointer"
              onClick={() => window.open(menuItem.itemLink, '_blank')}
            >
              {menuItem.itemName}
            </Button>
          );
        }
      });

  return (
    <Container TwClassName="flex-col h-full w-full justify-between">
      <Container TwClassName="flex-col h-full w-full items-start">
        {renderMenuItems(primaryMenu?.menuItems || [])}
      </Container>

      {!isLoginHidden && (
        <Button
          TwClassName="w-full p-2 bg-primary rounded-xl text-white border-1 border-primary hover:bg-transparent hover:text-primary" 
          cursor="pointer"
          onClick={() => clientNavigation('/login', 'Auth', 'authenticationPage')()}
        >
          {isLoading ? <Loader variant="spinner" color="bg-white-500" /> : <Text text="Login" TwClassName="text-white" />}
        </Button>)}
    </Container>
  );
};

export default LoggedOutDrawerContent;
