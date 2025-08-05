import React from 'react';
import { format } from 'date-fns';
import type { ClientAuthUser } from '../../auth/ClientAuthUserTypes';
import type { Friend } from '../friendTypes';
import { useNavigationHook } from '../../../../hooks/useNavigationHook';
import { useAppSelector } from '../../../../app/hooks';
import { useFriendActions } from '../../../hooks/useFriendActions';
import { buildQuery } from '../../../../services/database/queryBuilder';
import { getDocumentsByQuery } from '../../../../services/database/readData';
import { deleteDocument } from '../../../../services/database/deleteData';
import Image from '../../../../shared/components/image/Image';
import Container from '../../../../shared/components/container/Container';
import Text from '../../../../shared/components/text/Text';
import Button from '../../../../shared/components/button/Button';
import Icon from '../../../../shared/components/icon/Icon';
import Loader from '../../../../shared/components/loader/Loader';

export type FriendStatus = 'received' | 'sent' | 'accepted';

export interface FriendCardProps {
  friend: ClientAuthUser;
  meta: Friend & { source: FriendStatus };
  isLoading?: boolean;
  onAction?: (action: 'accept' | 'decline' | 'unfriend' | 'rescind', friendId: string) => void;
}

interface ActionConfig {
  primary?: {
    label: string;
    icon: string;
    className: string;
    action: () => void;
  };
  secondary?: {
    label: string;
    icon: string;
    className: string;
    action: () => void;
  };
}

const FriendCard: React.FC<FriendCardProps> = ({ 
  friend, 
  meta, 
  isLoading = false,
  onAction 
}) => {
  const clientNavigation = useNavigationHook();
  const authUser = useAppSelector((state) => state.authUser.user)
  const {
    acceptFriend,
    removeFriend,
  } = useFriendActions({
    userIdFromUrl: friend.userId,
    receivedRequestId: meta.source === 'received' ? meta.id : undefined,
    sentRequestId: meta.source === 'sent' ? meta.id : undefined,
    acceptedRequestId: meta.source === 'accepted' ? meta.id : undefined,
    isAcceptedRequest: meta.source === 'accepted',
  });

  const handleRescindNotifDelete = async (friendId: string) => {
    if (!authUser?.userId) return;

    const notificationsQuery = buildQuery("Notifications", [
      ["senderUserId", "==", authUser.userId],
      ["recieverUserId", "==", friendId],
    ]);

    console.log(notificationsQuery)
    const notifications = await getDocumentsByQuery(notificationsQuery);

    if (!notifications) return;

    await Promise.all(
      notifications.map(n => deleteDocument("Notifications", n.id))
    );

    console.log(`Deleted ${notifications.length} notification(s).`);
  };

  const handleAction = async (actionType: 'accept' | 'decline' | 'unfriend' | 'rescind') => {
    onAction?.(actionType, friend.userId);
    
    switch (actionType) {
      case 'accept':
        await acceptFriend();
        break;
      case 'decline':
      case 'unfriend':
        await removeFriend();
        break;
      case 'rescind':
        handleRescindNotifDelete(friend.userId)
        await removeFriend();
        break;
    }
  };

  const getActionConfig = (): ActionConfig => {
    const baseButtonClasses = "w-full relative flex-1 mt-3 p-1 rounded-xl border flex justify-center items-center";
    const primaryButton = `${baseButtonClasses} bg-primary text-white border-primary hover:bg-transparent hover:text-primary`;
    const errorButton = `${baseButtonClasses} bg-error text-white border-error hover:bg-transparent hover:text-error`;

    switch (meta.source) {
      case 'accepted':
        return {
          primary: {
            label: 'Unfriend',
            icon: 'UserMinus',
            className: errorButton,
            action: () => handleAction('unfriend')
          }
        };
      
      case 'sent':
        return {
          primary: {
            label: 'Rescind',
            icon: 'UserMinus',
            className: errorButton,
            action: () => handleAction('rescind')
          }
        };
      
      case 'received':
        return {
          primary: {
            label: 'Accept',
            icon: 'UserPlus',
            className: primaryButton,
            action: () => handleAction('accept')
          },
          secondary: {
            label: 'Decline',
            icon: 'UserMinus',
            className: errorButton,
            action: () => handleAction('decline')
          }
        };
      
      default:
        return {};
    }
  };

  const getStatusText = (): string => {
    const friendName = friend.firstName || 'User';
    const dateFormatted = format(
      new Date(meta.source === 'accepted' ? meta.acceptedAt : meta.createdAt), 
      'EEEE, MMMM do, yyyy'
    );

    switch (meta.source) {
      case 'accepted':
        return `Friends since: ${dateFormatted}`;
      case 'sent':
        return `You invited ${friendName} to be friends on: ${dateFormatted}`;
      case 'received':
        return `${friendName} invited you to be friends on: ${dateFormatted}`;
      default:
        return '';
    }
  };

  const renderAvatar = () => {
    if (friend.profileImage) {
      return (
        <Image
          src={friend.profileImage}
          alt={`${friend.firstName} ${friend.lastName}`}
          TwClassName="w-20 h-20 rounded-full border border-gray-300 cursor-pointer object-cover border-3 border-white"
        />
      );
    }

    const initials = `${friend.firstName?.[0] || ''}${friend.lastName?.[0] || ''}`.toUpperCase();
    
    return (
      <Container TwClassName="-ml-1.5 rounded-full w-20 h-20 bg-black cursor-pointer flex justify-center items-center border-3 border-white">
        <Text
          TwClassName="text-white w-full text-sm font-semibold leading-[2.5rem] text-center"
          text={initials}
        />
      </Container>
    );
  };

  const renderActionButton = (config: ActionConfig['primary'] | ActionConfig['secondary']) => {
    if (!config) return null;

    return (
      <Button
        onClick={(e) => {
          e.stopPropagation(); 
          config.action();
        }}
        TwClassName={config.className}
        disabled={isLoading}
      >
        <span className="absolute left-3">
          <Icon name={config.icon as any} />
        </span>
        {isLoading ? (
          <Loader variant="spinner" color="bg-primary" />
        ) : (
          config.label
        )}
      </Button>
    );
  };

  const actionConfig = getActionConfig();
  const statusText = getStatusText();
  const fullName = `${friend.firstName || ''} ${friend.lastName || ''}`.trim();

  return (
    <Container
      onClick={() => clientNavigation(`/profile/${friend.userId}`, 'Profile', '')()}
      key={friend.userId}
      TwClassName="flex-col w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.5rem)] box-border border border-gray-300 rounded-xl p-4"
    >
      <Container TwClassName="flex-col w-full items-center justify-center">
        {renderAvatar()}

        <Text
          TwClassName="text-black text-xl font-bold"
          text={fullName || 'Unknown User'}
        />
        
        <Text 
          TwClassName="text-black text-md" 
          text={friend.email || ''} 
        />

        <Container TwClassName="flex-col flex-grow w-full">
          {actionConfig.secondary && renderActionButton(actionConfig.secondary)}
          {actionConfig.primary && renderActionButton(actionConfig.primary)}
          
          {statusText && (
            <Text
              TwClassName="text-xs text-gray-500 mt-2 text-center"
              text={statusText}
            />
          )}
        </Container>
      </Container>
    </Container>
  );
};

export default FriendCard;