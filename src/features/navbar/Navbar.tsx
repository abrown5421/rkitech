import React from 'react';
import Container from '../../shared/components/container/Container';
import Text from '../../shared/components/text/Text';
import Button from '../../shared/components/button/Button';
import Image from '../../shared/components/image/Image';
import { useNavigationHook } from '../../hooks/useNavigationHook';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { openDrawer, preCloseDrawer } from '../drawer/drawerSlice';
import { getTimeOfDay } from '../../shared/utils/getTimeOfDay';
import Icon from '../../shared/components/icon/Icon';
import './navbar.css';

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const clientNavigation = useNavigationHook();
  const authUser = useAppSelector((state) => state.authUser);
  const pages = useAppSelector((state) => state.pages.pages);
  const activePage = useAppSelector((state) => state.pageShell.activePageShellName);
  const menus = useAppSelector((state) => state.menus);
  const primaryMenu = menus.menus.find((menu) => menu.menuName === 'Primary Menu');
  const isLoginHidden = activePage === 'Auth';

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

  const handleDrawerOpen = (title: string, contentType: 'loggedInMenu' | 'loggedOutMenu') => {
    dispatch(
      openDrawer({
        title,
        contentType,
        anchor: 'right',
        animation: {
          entranceAnimation: 'animate__fadeInRight animate__faster',
          exitAnimation: 'animate__fadeOutRight animate__faster',
          isEntering: true,
        },
      })
    );
  };

  return (
    <Container
      height={50}
      padding="sm"
      justifyContent="between"
      alignItems="center"
      bgColor="bg-white"
      className="relative z-40 shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
    >
      <Container
        alignItems="center"
        animation={{
          entranceExit: {
            entranceAnimation: 'animate__fadeInLeft',
            exitAnimation: 'animate__fadeOutLeft',
            isEntering: true,
          },
        }}
      >
        <Image src="../../../public/assets/images/logo.png" height={50} alt="Rkitech" />
        <Text text="Rkitech" bold size="xl" font="primary" color="text-black" />
      </Container>

      <Container
        alignItems="center"
        className="md:hidden"
        animation={{
          entranceExit: {
            entranceAnimation: 'animate__fadeInRight',
            exitAnimation: 'animate__fadeOutRight',
            isEntering: true,
          },
        }}
      >
        {authUser?.user ? (
          <Button
            padding="sm"
            variant="ghost"
            cursor="pointer"
            onClick={() => handleDrawerOpen(`${getTimeOfDay()}, ${authUser.user?.firstName}`, 'loggedInMenu')}
          >
            {authUser?.user.profileImage ? (
              <Image
                src={authUser.user.profileImage}
                alt="User Avatar"
                width={40}
                height={40}
                className="rounded-full border border-gray-300 cursor-pointer"
              />
            ) : (
              <Container className="rounded-full w-10 h-10 bg-black cursor-pointer flex justify-center items-center">
                <Text
                  className="text-white w-full text-sm font-semibold leading-[2.5rem] text-center"
                  text={`${authUser.user.firstName?.[0] || ''}${authUser.user.lastName?.[0] || ''}`.toUpperCase()}
                />
              </Container>
            )}
          </Button>
        ) : (
          <Button
            padding="sm"
            color="primary"
            variant="ghost"
            cursor="pointer"
            onClick={() => handleDrawerOpen(getTimeOfDay(), 'loggedOutMenu')}
          >
            <Icon name="Menu" />
          </Button>
        )}
      </Container>

      <Container
        alignItems="center"
        className="gap-5 hidden md:flex"
        animation={{
          entranceExit: {
            entranceAnimation: 'animate__fadeInRight',
            exitAnimation: 'animate__fadeOutRight',
            isEntering: true,
          },
        }}
      >
        {renderMenuItems(primaryMenu?.menuItems || [])}

        {authUser?.user ? (
          <Button
            padding="sm"
            variant="ghost"
            cursor="pointer"
            onClick={() => handleDrawerOpen(`${getTimeOfDay()}, ${authUser.user?.firstName}`, 'loggedInMenu')}
          >
            {authUser.user.profileImage ? (
              <Image
                src={authUser.user.profileImage}
                alt="User Avatar"
                width={40}
                height={40}
                className="rounded-full border border-gray-300 cursor-pointer"
              />
            ) : (
              <Container className="rounded-full w-10 h-10 bg-black cursor-pointer flex justify-center items-center">
                <Text
                  className="text-white w-full text-sm font-semibold leading-[2.5rem] text-center"
                  text={`${authUser.user.firstName?.[0] || ''}${authUser.user.lastName?.[0] || ''}`.toUpperCase()}
                />
              </Container>
            )}
          </Button>
        ) : (
          <Container className={`collapse-wrapper ${isLoginHidden ? 'collapse-closed' : 'collapse-open'}`}>
            <Button
              padding="sm"
              color="primary"
              cursor="pointer"
              className={`transition-all duration-300 origin-right ${isLoginHidden ? 'collapse-hidden' : 'collapse-in'}`}
              onClick={() => clientNavigation('/login', 'Auth', 'authenticationPage')()}
            >
              <Text text="Login" color="white" />
            </Button>
          </Container>
        )}
      </Container>
    </Container>
  );
};

export default Navbar;
