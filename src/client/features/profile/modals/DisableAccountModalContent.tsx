import React from 'react';
import Cookies from 'js-cookie';
import Container from '../../../../shared/components/container/Container';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import Button from '../../../../shared/components/button/Button';
import Loader from '../../../../shared/components/loader/Loader';
import Text from '../../../../shared/components/text/Text';
import { preCloseModal } from '../../../../shared/features/modal/modalSlice';
import { setLoading, setNotLoading } from '../../../../app/globalSlices/loading/loadingSlice';
import { openAlert } from '../../../../shared/features/alert/alertSlice';
import { useNavigationHook } from '../../../../hooks/useNavigationHook';
import { updateDataInCollection } from '../../../../services/database/updateData';
import { clearClientAuthUser } from '../../auth/clientAuthUserSlice';

const DisableAccountModalContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const clientNavigation = useNavigationHook();
  const authUser = useAppSelector((state) => state.authUser.user);
  const { loading, id } = useAppSelector((state) => state.loading);
  const isProfilePicDeleting = loading && id === 'profileDeletion';

  const handleAccountDeletion = async () => {
    dispatch(setLoading({ loading: true, id: 'profileDeletion' }));

    try {
      if (!authUser?.userId) {
        dispatch(openAlert({
            alertOpen: true,
            alertSeverity: 'error',
            alertMessage: 'Unable to disable account. User ID is missing.',
            alertAnimation: {
            entranceAnimation: 'animate__fadeInRight animate__faster',
            exitAnimation: 'animate__fadeOutRight animate__faster',
            isEntering: true,
            },
        }));
        dispatch(setNotLoading());

        return;
    }
    
      await updateDataInCollection('Users', authUser.userId, {
            userRole: 'Disabled',
      });
      
      Cookies.remove('authUser');
      dispatch(clearClientAuthUser());

      dispatch(openAlert({
        alertOpen: true,
        alertSeverity: 'success',
        alertMessage: 'Account disabled successfully!',
        alertAnimation: {
          entranceAnimation: 'animate__fadeInRight animate__faster',
          exitAnimation: 'animate__fadeOutRight animate__faster',
          isEntering: true,
        },
      }));
    } catch (error: any) {
      dispatch(openAlert({
        alertOpen: true,
        alertSeverity: 'error',
        alertMessage: 'There was a problme disabling your account.',
        alertAnimation: {
          entranceAnimation: 'animate__fadeInRight animate__faster',
          exitAnimation: 'animate__fadeOutRight animate__faster',
          isEntering: true,
        },
      }));
    } finally {
      dispatch(setNotLoading());
      dispatch(preCloseModal());
      clientNavigation('/', 'Home', 'homePage')();
    }
  };

  return (
    <Container TwClassName="flex-col h-full justify-between gap-4">
      <Text text="WARNING:" TwClassName="text-md font-bold text-warning" />
      <Text text="This action cannot be undone from the website and must be reactivated through an administrator. All of your profile data, uploaded photos, and friendships will be saved and can be recovered. If you are absolutely sure you would like to disable your account, please click disable below." />
      
      <Container TwClassName="flex-row justify-end gap-5">
        <Container TwClassName="flex-col">
          <Button
            onClick={() => {
                dispatch(preCloseModal())
                dispatch(setNotLoading())
            }}
            TwClassName="min-w-[100px] mt-2 p-2 bg-gray-300 rounded-xl text-white border-1 border-gray-300 hover:bg-transparent hover:text-gray-300 flex-1"
          >
            Cancel
          </Button>
        </Container>
        <Container TwClassName="flex-col">
          <Button
            onClick={handleAccountDeletion}
            TwClassName="min-w-[100px] mt-2 p-2 bg-warning rounded-xl text-white border-1 border-warning hover:bg-transparent hover:text-warning flex-1"
          >
            {isProfilePicDeleting ? (
              <Loader variant="spinner" color="bg-white" />
            ) : (
              <>Disable</>
            )}
          </Button>
        </Container>
      </Container>
    </Container>
  );
};

export default DisableAccountModalContent;
