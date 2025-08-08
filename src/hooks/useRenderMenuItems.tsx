import type { Page } from '../shared/features/pages/pageTypes';
import type { Notification } from '../client/features/notifications/notificationTypes';
import type { ClientAuthUser } from '../client/features/auth/ClientAuthUserTypes';
import { useAppDispatch } from '../app/hooks';
import { preCloseDrawer } from '../shared/features/drawer/drawerSlice';
import Container from '../shared/components/container/Container';
import Button from '../shared/components/button/Button';

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

        const isProfilePage = page.pageName === 'Profile';
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
            if (isProfilePage) targetPath = `/profile/${userId}`;
            onNavigate(targetPath, page.pageName, page.pageID);
          }, 250);
        };

        if (extraOptions?.isLoggedIn) {
          return (
            <Container
              key={menuItem.itemId}
              onClick={onClickHandler}
              TwClassName={`pt-3 pr-0 pb-3 pl-0 flex-row w-full justify-between items-center cursor-pointer ${
                activePage === menuItem.itemName ? 'text-primary' : 'text-black'
              } hover:text-primary hover:bg-gray-100`}
            >
              {page.pageName}
              {friendRequestCount > 0 && (
                <Container TwClassName="bg-error text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow ml-2">
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
                activePage === menuItem.itemName ? 'text-primary' : 'text-black'
              } hover:text-primary ${animationClass}`}
              style={{ animationDelay: delay }}
              cursor="pointer"
              onClick={onClickHandler}
            >
              {page.pageName}
            </Button>
          );
        }
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

  return renderMenuItems;
};
