import React, { useState } from 'react';
import Cookies from 'js-cookie';
import Container from '../../../../shared/components/container/Container';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import Button from '../../../../shared/components/button/Button';
import Loader from '../../../../shared/components/loader/Loader';
import Text from '../../../../shared/components/text/Text';
import { preCloseModal } from '../../../../shared/features/modal/modalSlice';
import Input from '../../../../shared/components/input/Input';
import { deleteAuthenticatedAccount } from '../../../../services/auth/updateAuthProfile';
import { setLoading, setNotLoading } from '../../../../app/globalSlices/loading/loadingSlice';
import { openAlert } from '../../../../shared/features/alert/alertSlice';
import { useNavigationHook } from '../../../../hooks/useNavigationHook';

const DeleteAccountModalContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const clientNavigation = useNavigationHook();
  const authUser = useAppSelector((state) => state.authUser.user);
  const { loading, id } = useAppSelector((state) => state.loading);
  const isProfilePicDeleting = loading && id === 'profileDeletion';

  const [password, setPassword] = useState({
    input: '',
    error: false,
    helperText: '',
  });

  const handleAccountDeletion = async () => {
    if (!password.input.trim()) {
      setPassword((prev) => ({
        ...prev,
        error: true,
        helperText: 'Password is required to delete account.',
      }));

      return;
    }

    dispatch(setLoading({ loading: true, id: 'profileDeletion' }));

    try {
      if (!authUser?.userId) {
        dispatch(setNotLoading());
        dispatch(openAlert({
            alertOpen: true,
            alertSeverity: 'error',
            alertMessage: 'Unable to delete account. User ID is missing.',
            alertAnimation: {
            entranceAnimation: 'animate__fadeInRight animate__faster',
            exitAnimation: 'animate__fadeOutRight animate__faster',
            isEntering: true,
            },
        }));

        return;
    }
    await deleteAuthenticatedAccount(password.input, authUser.userId);

      dispatch(openAlert({
        alertOpen: true,
        alertSeverity: 'success',
        alertMessage: 'Account deleted successfully!',
        alertAnimation: {
          entranceAnimation: 'animate__fadeInRight animate__faster',
          exitAnimation: 'animate__fadeOutRight animate__faster',
          isEntering: true,
        },
      }));
    } catch (error: any) {
      let message = 'Error deleting account.';

      if (error?.code === 'auth/wrong-password') {
        message = 'The password you entered is incorrect.';
        setPassword((prev) => ({
          ...prev,
          error: true,
          helperText: message,
        }));
      } else if (error?.code === 'auth/too-many-requests') {
        message = 'Too many attempts. Please try again later.';
      }

      dispatch(openAlert({
        alertOpen: true,
        alertSeverity: 'error',
        alertMessage: message,
        alertAnimation: {
          entranceAnimation: 'animate__fadeInRight animate__faster',
          exitAnimation: 'animate__fadeOutRight animate__faster',
          isEntering: true,
        },
      }));
    } finally {
      Cookies.remove('authUser');
      dispatch(setNotLoading());
      dispatch(preCloseModal());
      clientNavigation('/', 'Home', 'homePage')();
    }
  };

  return (
    <Container TwClassName="flex-col h-full justify-between gap-4">
      <Text text="WARNING:" TwClassName="text-md font-bold text-error" />
      <Text text="This action cannot be undone. All of your profile data, uploaded photos, and friendships will be lost forever. If you are absolutely sure you would like to delete your account, please enter your password below." />
      <Input
        label="Password"
        type="password"
        value={password.input}
        error={password.error}
        helperText={password.helperText}
        onChange={(e) =>
          setPassword({
            input: e.target.value,
            error: false,
            helperText: '',
          })
        }
        placeholder="Enter your current password"
      />
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
            TwClassName="min-w-[100px] mt-2 p-2 bg-error rounded-xl text-white border-1 border-error hover:bg-transparent hover:text-error flex-1"
          >
            {isProfilePicDeleting ? (
              <Loader variant="spinner" color="bg-white" />
            ) : (
              <>Delete</>
            )}
          </Button>
        </Container>
      </Container>
    </Container>
  );
};

export default DeleteAccountModalContent;
