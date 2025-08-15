
import React from 'react';
import { useNavigationHook } from '../../../../hooks/useNavigationHook';
import { useAppSelector } from '../../../../app/hooks';
import Button from '../../../../shared/components/button/Button';
import Container from '../../../../shared/components/container/Container';
import Loader from '../../../../shared/components/loader/Loader';
import Text from '../../../../shared/components/text/Text';
import { useRenderMenuItems } from '../../../hooks/useRenderMenuItems';

const LoggedOutDrawerContent: React.FC = () => {
  const clientNavigation = useNavigationHook();
  const menus = useAppSelector((state) => state.menus);
  const pages = useAppSelector((state) => state.pages.pages);
  const authComp = pages.find((page) => page.componentKey === 'LoginComp')
  const activePage = useAppSelector((state) => state.pageShell.activePageShellName);
  const { loading, id } = useAppSelector((state) => state.loading);
  const isLoading = loading && id === 'logoutButton';
  const isLoginHidden = activePage === 'Auth';

  const primaryMenu = menus.menus.find((menu) => menu.menuName === 'Primary Menu');

  const renderMenuItems = useRenderMenuItems({
    menuItems: primaryMenu?.menuItems || [],
    pages,
    activePage,
    onNavigate: (path, name, id) => {
      clientNavigation(path, name, id)();
    },
    withAnimation: false
  });

  return (
    <Container TwClassName="flex-col h-full w-full justify-between">
      <Container TwClassName="flex-col h-full w-full items-start">
        {renderMenuItems}
      </Container>

      {!isLoginHidden && (
        <Button
          TwClassName="w-full p-2 bg-primary rounded-xl text-white border-1 border-primary hover:bg-transparent hover:text-primary" 
          cursor="pointer"
          onClick={() => clientNavigation(authComp?.pagePath ?? '', 'Auth', authComp?.pageID ?? '')()}
        >
          {isLoading ? <Loader variant="spinner" color="bg-white-500" /> : <Text text="Login" TwClassName="text-white" />}
        </Button>)}
    </Container>
  );
};

export default LoggedOutDrawerContent;
