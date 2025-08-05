import React from 'react'; 
import clsx from 'clsx';
import type { TabProps } from './tabTypes';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { markAsRead } from '../../features/notifications/notificationSlice';
import Container from '../../shared/components/container/Container';
import Button from '../../shared/components/button/Button';
import { deleteDocument } from '../../services/database/deleteData';

const Tab: React.FC<TabProps> = ({ label, active, onClick }) => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((state) => state.notifications);
  const authUser = useAppSelector((state) => state.authUser.user);

  const notificationObj = notifications.notifications.filter(
    (n) =>
      n.senderUserId === authUser?.userId &&
      !n.isRead &&
      n.type === "friend_request"
  );

  const handleClick = () => {
    if (label === 'Friend Requests' && notificationObj.length > 0) {
      notificationObj.forEach((notif) => {
        deleteDocument('Notifications', notif.id)
        dispatch(markAsRead(notif.id));
      });
    }
    onClick();
  };

  return (
    <Button
      onClick={handleClick}
      TwClassName={clsx(
        'relative px-4 py-2 border-b-2 text-sm font-medium cursor-pointer transition-colors duration-300 ease-in-out',
        active
          ? 'border-primary text-primary'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      )}
    >
      {label}
      {notificationObj.length > 0 && label === 'Friend Requests' && (
        <Container TwClassName="absolute top-0 right-0 bg-error text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow ml-2">
          {notificationObj.length}
        </Container>
      )}
    </Button>
  );
};

export default Tab;
