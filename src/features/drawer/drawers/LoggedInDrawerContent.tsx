import React from 'react';
import Container from '../../../shared/components/container/Container';
import Text from '../../../shared/components/text/Text';
import Button from '../../../shared/components/button/Button';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { preCloseDrawer } from '../../drawer/drawerSlice';
import { useNavigationHook } from '../../../hooks/useNavigationHook';
import Loader from '../../../shared/components/loader/Loader';
import { setLoading, setNotLoading } from '../../../app/globalSlices/loading/loadingSlice';
import Cookies from 'js-cookie';
import { clearAuthUser } from '../../auth/authUserSlice';

const LoggedInDrawerContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const clientNavigation = useNavigationHook();

  const menus = useAppSelector((state) => state.menus);
  const pages = useAppSelector((state) => state.pages.pages);
  const activePage = useAppSelector((state) => state.pageShell.activePageShellName);
  const authUser = useAppSelector((state) => state.authUser);
  const { loading, id } = useAppSelector((state) => state.loading);
  const isLoading = loading && id === 'logoutButton';

  const primaryMenu = menus.menus.find((menu) => menu.menuName === 'Primary Menu');
  const profileMenu = menus.menus.find((menu) => menu.menuName === 'Profile Menu');

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
                dispatch(preCloseDrawer());
                setTimeout(() => {
                  let targetPath = page.pagePath;
                  if (page.pageName === 'Profile') {
                    const userId = authUser.user?.userId;
                    targetPath = `/profile/${userId}`;
                  }
                  clientNavigation(targetPath, page.pageName, page.pageID)();
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

  const handleLogout = () => {
    dispatch(setLoading({ loading: true, id: 'logoutButton' }));
    Cookies.remove('authUser');
    dispatch(clearAuthUser());
    dispatch(setNotLoading());
    clientNavigation('/login', 'Auth', 'authenticationPage')();
  };

  return (
    <Container flexDirection="col" height="h-full" width="w-full" justifyContent="between">
      <Container flexDirection="col" height="h-full" width="w-full" alignItems="start">
        {/* Mobile Primary Menu with separator */}
        <Container flexDirection="col" width="w-full" alignItems="start" className="md:hidden">
          {renderMenuItems(primaryMenu?.menuItems || [])}
          <hr className="w-full border-gray-300 my-2" />
        </Container>

        {/* Profile Menu */}
        {renderMenuItems(profileMenu?.menuItems || [])}
      </Container>

      {/* Logout Button */}
      <Button width="w-full" padding="sm" color="primary" cursor="pointer" onClick={handleLogout}>
        {isLoading ? <Loader variant="spinner" color="bg-white" /> : <Text text="Logout" color="white" />}
      </Button>
    </Container>
  );
};

export default LoggedInDrawerContent;
