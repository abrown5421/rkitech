
import React from 'react';
import Cookies from 'js-cookie';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { useNavigationHook } from '../../../../hooks/useNavigationHook';
import Container from '../../../../shared/components/container/Container';
import { preCloseDrawer } from '../../../../shared/features/drawer/drawerSlice';
import Button from '../../../../shared/components/button/Button';
import { setLoading, setNotLoading } from '../../../../app/globalSlices/loading/loadingSlice';
import Loader from '../../../../shared/components/loader/Loader';
import Text from '../../../../shared/components/text/Text';
import { clearAdminAuthUser } from '../../auth/adminAuthUserSlice';

const LoggedInAdminDrawerContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const clientNavigation = useNavigationHook();

  const menus = useAppSelector((state) => state.menus);
  const pages = useAppSelector((state) => state.pages.pages);
  const activePage = useAppSelector((state) => state.pageShell.activePageShellName);
  const adminAuthUser = useAppSelector((state) => state.adminAuthUser);
  const { loading, id } = useAppSelector((state) => state.loading);
  const isLoading = loading && id === 'logoutButton';

  const profileMenu = menus.menus.find((menu) => menu.menuName === 'Admin Menu');

  const renderMenuItems = (menuItems: any[]) =>
    menuItems
      ?.slice()
      .sort((a, b) => a.itemOrder - b.itemOrder)
      .map((menuItem) => {
        if (menuItem.itemType === 'page') {
          const page = pages.find((p) => p.pageID === menuItem.itemId);
          if (!page) return null;
          return (
            <Container 
              onClick={() => {
                dispatch(preCloseDrawer());
                setTimeout(() => {
                  let targetPath = page.pagePath;
                  if (page.pageName === 'Profile') {
                    const userId = adminAuthUser.user?.userId;
                    targetPath = `/profile/${userId}`;
                  }
                  clientNavigation(targetPath, page.pageName, page.pageID)();
                }, 250);
              }}
              TwClassName={`pt-3 pr-0 pb-3 pl-0 flex-row w-full justify-between items-center cursor-pointer ${activePage === menuItem.itemName ? 'text-primary' : 'text-black'} hover:text-primary hover:bg-gray-100`}
            >
              {menuItem.itemName}
            </Container>
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

  const handleLogout = () => {
    dispatch(setLoading({ loading: true, id: 'logoutButton' }));
    dispatch(preCloseDrawer());
    clientNavigation('/', 'Home', '')()
    setTimeout(() => {
      dispatch(setNotLoading())
      Cookies.remove('adminAuthUser');
      dispatch(clearAdminAuthUser());
    }, 500)
  };

  return (
    <Container TwClassName="flex-col h-full w-full justify-between">
      <Container TwClassName="flex-col h-full w-full items-start">
        {renderMenuItems(profileMenu?.menuItems || [])}
      </Container>

      <Button TwClassName="w-full p-2 bg-primary rounded-xl text-white border-1 border-primary hover:bg-transparent hover:text-primary" cursor="pointer" onClick={handleLogout}>
        {isLoading ? <Loader variant="spinner" color="bg-white" /> : <Text text="Logout" />}
      </Button>
    </Container>
  );
};

export default LoggedInAdminDrawerContent;