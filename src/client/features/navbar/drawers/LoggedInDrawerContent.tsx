
import React from 'react';
import Cookies from 'js-cookie';
import { clearClientAuthUser } from '../../auth/clientAuthUserSlice';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { useNavigationHook } from '../../../../hooks/useNavigationHook';
import Container from '../../../../shared/components/container/Container';
import { preCloseDrawer } from '../../../../shared/features/drawer/drawerSlice';
import Button from '../../../../shared/components/button/Button';
import { setLoading, setNotLoading } from '../../../../app/globalSlices/loading/loadingSlice';
import Loader from '../../../../shared/components/loader/Loader';
import Text from '../../../../shared/components/text/Text';
import { useRenderMenuItems } from '../../../hooks/useRenderMenuItems';

const LoggedInDrawerContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const clientNavigation = useNavigationHook();

  const menus = useAppSelector((state) => state.menus);
  const pages = useAppSelector((state) => state.pages.pages);
  const homePageId = useAppSelector((state) => state.homePageId);
  const notifications = useAppSelector((state) => state.notifications);
  const activePage = useAppSelector((state) => state.pageShell.activePageShellName);
  const authUser = useAppSelector((state) => state.authUser);
  const { loading, id } = useAppSelector((state) => state.loading);
  const isLoading = loading && id === 'logoutButton';

  const primaryMenu = menus.menus.find((menu) => menu.menuName === 'Primary Menu');
  const profileMenu = menus.menus.find((menu) => menu.menuName === 'Profile Menu');

  const renderPrimaryMenuItems = useRenderMenuItems({
    menuItems: primaryMenu?.menuItems || [],
    pages,
    activePage,
    authUser: authUser.user,
    notifications: notifications.notifications,
    onNavigate: (path, name, id) => clientNavigation(path, name, id)(),
    extraOptions: { isLoggedIn: true },
  });

  const renderProfileMenuItems = useRenderMenuItems({
    menuItems: profileMenu?.menuItems || [],
    pages,
    activePage,
    authUser: authUser.user,
    notifications: notifications.notifications,
    onNavigate: (path, name, id) => clientNavigation(path, name, id)(),
    extraOptions: { isLoggedIn: true },
    withAnimation: false
  });

  const handleLogout = () => {
    dispatch(setLoading({ loading: true, id: 'logoutButton' }));
    dispatch(preCloseDrawer());
    clientNavigation(homePageId.homePageObj?.pagePath ?? '', 'Home', homePageId.id ?? '')()
    setTimeout(() => {
      dispatch(setNotLoading())
      Cookies.remove('authUser');
      dispatch(clearClientAuthUser());
    }, 500)
  };

  return (
    <Container TwClassName="flex-col h-full w-full justify-between">
      <Container TwClassName="flex-col h-full w-full items-start">
        <Container TwClassName="flex-col w-full items-start md:hidden">
          {renderPrimaryMenuItems}
          <hr className="w-full border-gray-300 my-2" />
        </Container>

        {renderProfileMenuItems}
      </Container>

      <Button TwClassName="w-full p-2 bg-primary rounded-xl text-white border-1 border-primary hover:bg-transparent hover:text-primary" cursor="pointer" onClick={handleLogout}>
        {isLoading ? <Loader variant="spinner" color="bg-white-500" /> : <Text text="Logout" />}
      </Button>
    </Container>
  );
};

export default LoggedInDrawerContent;
