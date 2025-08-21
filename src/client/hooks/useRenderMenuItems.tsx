import { useState } from 'react';
import type { Page } from '../../shared/features/pages/pageTypes';
import type { ClientAuthUser } from '../features/auth/ClientAuthUserTypes';
import type { Notification } from '../features/notifications/notificationTypes';
import { useAppDispatch } from '../../app/hooks';
import { preCloseDrawer } from '../../shared/features/drawer/drawerSlice';
import Container from '../../shared/components/container/Container';
import Button from '../../shared/components/button/Button';

interface RenderMenuItemsProps {
  menuItems: any[];
  pages: Page[];
  activePage: string;
  authUser?: ClientAuthUser | null;
  notifications?: Notification[];
  onNavigate: (path: string, name: string, id: string) => void;
  extraOptions?: {
    isLoggedIn?: boolean;
  };
  withAnimation?: boolean;
}

export const useRenderMenuItems = ({
  menuItems,
  pages,
  activePage,
  authUser,
  notifications,
  onNavigate,
  extraOptions,
  withAnimation = true,
}: RenderMenuItemsProps) => {
  const dispatch = useAppDispatch();

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const toggleDropdown = (id: string) => {
    setOpenDropdownId((prev) => (prev === id ? null : id));
  };

  const renderMenuItems = menuItems
    ?.slice()
    .sort((a, b) => a.itemOrder - b.itemOrder)
    .map((menuItem, index) => {
      const totalItems = menuItems.length;
      const delay = `${(totalItems - index) * 200}ms`;
      const animationClass = withAnimation ? 'animate__animated animate__fadeIn animate__faster' : '';

      if (menuItem.itemType === 'page') {
        const page = pages.find((p) => p.pageID === menuItem.itemId);
        if (!page || !page.pageActive) return null;

        const isProfilePage = page.componentKey === 'ProfileComp';
        const userId = authUser?.userId || '';

        const friendRequestCount = isProfilePage && extraOptions?.isLoggedIn && notifications
          ? notifications.filter(
              (n) =>
                !n.isRead &&
                n.type === 'friend_request' &&
                n.senderUserId === authUser?.userId
            ).length
          : 0;

        const onClickHandler = () => {
          dispatch(preCloseDrawer());
          setTimeout(() => {
            let targetPath = page.pagePath;
            if (isProfilePage) targetPath = `${page.pagePath}/${userId}`;
            onNavigate(targetPath, page.pageName, page.pageID);
          }, 250);
        };

        if (extraOptions?.isLoggedIn) {
          return (
            <Container
              key={menuItem.itemId}
              onClick={onClickHandler}
              TwClassName={`pt-3 pr-0 pb-3 pl-0 flex-row w-full justify-between items-center cursor-pointer ${
                activePage === menuItem.itemName ? 'text-amber-500' : 'text-gray-900'
              } hover:text-amber-500 hover:bg-gray-100`}
            >
              {page.pageName}
              {friendRequestCount > 0 && (
                <Container TwClassName="bg-error text-gray-50 text-xs font-bold rounded-full w-5 h-5 flex items-center shadow ml-2">
                  {friendRequestCount}
                </Container>
              )}
            </Container>
          );
        } else {
          return (
            <Button
              key={menuItem.itemId}
              TwClassName={`pt-3 pr-0 pb-3 pl-0 ${
                activePage === menuItem.itemName ? 'text-amber-500' : 'text-gray-900'
              } hover:text-amber-500 ${animationClass}`}
              style={{ animationDelay: delay }}
              cursor="pointer"
              onClick={onClickHandler}
            >
              {page.pageName}
            </Button>
          );
        }
      }

      if (menuItem.itemType === 'dropdown') {
        const isOpen = openDropdownId === menuItem.itemId;

        return (
          <Container key={menuItem.itemId} TwClassName={`relative ${animationClass}`} style={{ animationDelay: delay }}>
            <Button
              TwClassName={`pt-3 pr-0 pb-3 pl-0 text-gray-900 hover:text-amber-500 flex items-center gap-1 ${animationClass}`}
              cursor="pointer"
              onClick={() => toggleDropdown(menuItem.itemId)}
              aria-expanded={isOpen}
              aria-haspopup="true"
              style={{ animationDelay: delay }}
            >
              {menuItem.itemName}
              <svg
                className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
              </svg>
            </Button>

            {isOpen && (
              <Container
                TwClassName="flex-col absolute top-full -left-1 mt-1 bg-gray-50 border border-gray-200 rounded shadow-md z-50 "
                onClick={(e) => e.stopPropagation()} 
              >
                {menuItem.itemChildren
                  ?.slice()
                  .sort((a: any, b: any) => a.itemOrder - b.itemOrder)
                  .map((child: any) => {
                    if (child.itemType === 'page') {
                      const page = pages.find((p) => p.pageID === child.itemId);
                      if (!page || !page.pageActive) return null;

                      const onChildClick = () => {
                        dispatch(preCloseDrawer());
                        setTimeout(() => {
                          onNavigate(page.pagePath, page.pageName, page.pageID);
                          setOpenDropdownId(null);
                        }, 250);
                      };

                      return (
                        <Button
                          key={child.itemId}
                          TwClassName={`block w-full text-left px-4 py-2 text-gray-900 hover:bg-gray-100`}
                          cursor="pointer"
                          onClick={onChildClick}
                        >
                          {page.pageName}
                        </Button>
                      );
                    }

                    if (child.itemType === 'link') {
                      return (
                        <Button
                          key={child.itemName}
                          TwClassName="block w-full text-left px-4 py-2 text-gray-900 hover:bg-gray-100"
                          cursor="pointer"
                          onClick={() => {
                            window.open(child.itemLink, '_blank');
                            setOpenDropdownId(null);
                          }}
                        >
                          {child.itemName}
                        </Button>
                      );
                    }


                    return null;
                  })}
              </Container>
            )}
          </Container>
        );
      }

      return (
        <Button
          key={menuItem.itemName}
          TwClassName={`pt-3 pr-0 pb-3 pl-0 text-gray-900 hover:text-amber-500 ${animationClass}`}
          cursor="pointer"
          style={{ animationDelay: delay }}
          onClick={() => window.open(menuItem.itemLink, '_blank')}
        >
          {menuItem.itemName}
        </Button>
      );
    });

  return renderMenuItems;
};
