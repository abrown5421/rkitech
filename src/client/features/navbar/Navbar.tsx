

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { useNavigationHook } from '../../../hooks/useNavigationHook';
import Button from '../../../shared/components/button/Button';
import { openDrawer, preCloseDrawer } from '../../../shared/features/drawer/drawerSlice';
import Container from '../../../shared/components/container/Container';
import Image from '../../../shared/components/image/Image';
import Text from '../../../shared/components/text/Text';
import { getTimeOfDay } from '../../../shared/utils/getTimeOfDay';
import Icon from '../../../shared/components/icon/Icon';
import type { DrawerContentType } from '../../../shared/features/drawer/drawerTypes';

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const clientNavigation = useNavigationHook();
  const authUser = useAppSelector((state) => state.authUser);
  const notifications = useAppSelector((state) => state.notifications);
  const pages = useAppSelector((state) => state.pages.pages);
  const activePage = useAppSelector((state) => state.pageShell.activePageShellName);
  const menus = useAppSelector((state) => state.menus);
  const primaryMenu = menus.menus.find((menu) => menu.menuName === 'Primary Menu');
  const isLoginHidden = activePage === 'Auth';
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50); 
    return () => clearTimeout(timer);
  }, []);

  const shouldShowLogin = mounted && !isLoginHidden;

  const renderMenuItems = (menuItems: any[]) =>
    menuItems
      ?.slice()
      .sort((a, b) => a.itemOrder - b.itemOrder)
      .map((menuItem, index) => {
        const totalItems = menuItems.length;
        const delay = `${(totalItems - index) * 200}ms`;
        const animationClass = "animate__animated animate__fadeIn";

        if (menuItem.itemType === 'page') {
          const page = pages.find((p) => p.pageID === menuItem.itemId);
          if (!page || !page.pageActive) return null;
          return (
            <Button
              key={menuItem.itemId}
              TwClassName={`pt-3 pr-0 pb-3 pl-0 ${activePage === menuItem.itemName ? 'text-primary' : 'text-black'} hover:text-primary ${animationClass}`}
              style={{ animationDelay: delay }}
              cursor="pointer"
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
              {page.pageName}
            </Button>
          );
        }

        return (
          <Button
            key={menuItem.itemName}
            TwClassName={`pt-3 pr-0 pb-3 pl-0 text-black hover:text-primary ${animationClass}`}
            cursor="pointer"
            style={{ animationDelay: delay }}
            onClick={() => window.open(menuItem.itemLink, '_blank')}
          >
            {menuItem.itemName}
          </Button>
        );
      });
      
  const handleDrawerOpen = (title: string, contentType: DrawerContentType) => {
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

  const unreadCount = notifications.notifications.filter(
    (n) => n.senderUserId === authUser.user?.userId && !n.isRead
  )?.length || 0;

  return (
    <Container
      TwClassName="h-[50px] justify-between items-center bg-white p-2 relative z-40 shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
    >
      <Container
        TwClassName="items-center"
        animation={{
          entranceExit: {
            entranceAnimation: 'animate__fadeInLeft',
            exitAnimation: 'animate__fadeOutLeft',
            isEntering: true,
          },
        }}
      >
        <Image src="../../../public/assets/images/logo.png" height={50} alt="Rkitech" />
        <Text text="Rkitech" TwClassName="text-xl font-primary text-black" />
      </Container>

      <Container
        TwClassName="items-center md:hidden"
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
            TwClassName="p-2"
            cursor="pointer"
            onClick={() => handleDrawerOpen(`${getTimeOfDay()}, ${authUser.user?.firstName}`, 'loggedInMenu')}
          >
            <div className="relative inline-block">
              {authUser?.user.profileImage ? (
                <Image
                  src={authUser.user.profileImage}
                  alt="User Avatar"
                  width={40}
                  height={40}
                  TwClassName="rounded-full border border-gray-300 cursor-pointer object-cover"
                />
              ) : (
                <Container TwClassName="rounded-full w-10 h-10 bg-black cursor-pointer flex justify-center items-center">
                  <Text
                    TwClassName="text-white w-full text-sm font-semibold leading-[2.5rem] text-center"
                    text={`${authUser.user.firstName?.[0] || ''}${authUser.user.lastName?.[0] || ''}`.toUpperCase()}
                  />
                </Container>
              )}

              
            </div>
          </Button>
        ) : (
          <Button
            TwClassName="p-2"
            cursor="pointer"
            onClick={() => handleDrawerOpen(getTimeOfDay(), 'loggedOutMenu')}
          >
            <Icon color="text-gray-900" name="Menu" />
          </Button>
        )}
      </Container>

      <Container
        TwClassName="items-center gap-5 hidden md:flex"
      >
        {renderMenuItems(primaryMenu?.menuItems || [])}

        {authUser?.user ? (
          <Button
            TwClassName="p-2"
            cursor="pointer"
            onClick={() => handleDrawerOpen(`${getTimeOfDay()}, ${authUser.user?.firstName}`, 'loggedInMenu')}
          >
            {authUser?.user.profileImage ? (
              <Image
                src={authUser.user.profileImage}
                alt="User Avatar"
                width={40}
                height={40}
                TwClassName="rounded-full border border-gray-300 cursor-pointer object-cover"
              />
            ) : (
              <Container TwClassName="rounded-full w-10 h-10 bg-black cursor-pointer flex justify-center items-center">
                <Text
                  TwClassName="text-white w-full text-sm font-semibold leading-[2.5rem] text-center"
                  text={`${authUser.user.firstName?.[0] || ''}${authUser.user.lastName?.[0] || ''}`.toUpperCase()}
                />
              </Container>
            )}

            {unreadCount > 0 && (
              <Container TwClassName="absolute top-0 right-1.5 bg-error text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow">
                {unreadCount}
              </Container>
            )}
            
          </Button>
        ) : (
          <Container TwClassName={`collapse-wrapper ${shouldShowLogin ? 'collapse-open' : 'collapse-closed'}`}>
            <Button
              cursor="pointer"
              TwClassName={`pt-1 pr-3 pb-1 pl-3 bg-primary rounded-xl text-white border-1 border-primary hover:bg-transparent hover:text-primary transition-all duration-300 origin-right ${isLoginHidden ? 'collapse-hidden' : 'collapse-open'}`}
              onClick={() => clientNavigation('/login', 'Auth', 'authenticationPage')()}
            >
              <Text text="Login" />
            </Button>
          </Container>
        )}
      </Container>
    </Container>
  );
};

export default Navbar;
