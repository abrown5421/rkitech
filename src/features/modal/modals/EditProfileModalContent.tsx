import React, { useState } from 'react';
import Container from '../../../shared/components/container/Container';
import Input from '../../../shared/components/input/Input';
import Button from '../../../shared/components/button/Button';
import type { EditProfileModalProps } from '../modalTypes';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import Loader from '../../../shared/components/loader/Loader';
import { preCloseModal } from '../modalSlice';
import { setLoading, setNotLoading } from '../../../app/globalSlices/loading/loadingSlice';
import { openAlert } from '../../alert/alertSlice';
import { setAuthUser } from '../../auth/authUserSlice';
import { updateDataInCollection } from '../../../services/database/updateData';
import { sendEmailChangeVerification } from '../../../services/auth/updateAuthProfile';
import type { AuthUser } from '../../auth/authUserTypes';

const EditProfileModalContent: React.FC<EditProfileModalProps> = (props) => {
  const { firstName: initialFirstName, lastName: initialLastName, email: initialEmail, userId } = props;
  const dispatch = useAppDispatch();
  const { loading, id } = useAppSelector((state) => state.loading);
  const authUser = useAppSelector((state) => state.authUser.user);

  const isProfileSaving = loading && id === 'profileSave';

  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');

  const emailChanged = email !== initialEmail;
  const nameChanged = firstName !== initialFirstName || lastName !== initialLastName;

  const handleSave = async () => {
    dispatch(setLoading({ loading: true, id: 'profileSave' }));

    try {
      const firestoreUpdate: Partial<AuthUser> = { firstName, lastName };

      if (emailChanged) {
        if (!password) throw new Error('Password required for email change');
        await sendEmailChangeVerification(email, password);
      } else {
        firestoreUpdate.email = email;
      }

      await updateDataInCollection('Users', userId ?? '', firestoreUpdate);

      const updatedUser: AuthUser = {
        ...authUser!,
        ...firestoreUpdate,
        userId,
      };

      dispatch(setAuthUser(updatedUser));
      dispatch(preCloseModal());
      dispatch(setNotLoading());

      let alertMessage = 'Account update was successful!';
      if (emailChanged && nameChanged) {
        alertMessage = 'Name updated and verification email sent to your new address.';
      } else if (emailChanged) {
        alertMessage = 'A verification email has been sent to your new email address. Please verify to complete the update.';
      } else if (nameChanged) {
        alertMessage = 'Name updated successfully!';
      }

      dispatch(openAlert({
        alertOpen: true,
        alertSeverity: 'success',
        alertMessage,
        alertAnimation: {
          entranceAnimation: 'animate__fadeInRight animate__faster',
          exitAnimation: 'animate__fadeOutRight animate__faster',
          isEntering: true,
        },
      }));

    } catch (error) {
      dispatch(setNotLoading());
      dispatch(preCloseModal());
      dispatch(openAlert({
        alertOpen: true,
        alertSeverity: 'error',
        alertMessage: 'Account update failed.',
        alertAnimation: {
          entranceAnimation: 'animate__fadeInRight animate__faster',
          exitAnimation: 'animate__fadeOutRight animate__faster',
          isEntering: true,
        },
      }));
    }
  };

  return (
    <Container TwClassName="flex-col h-full justify-between gap-4">
      <Input label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      <Input label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
      <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />

      {emailChanged && (
        <Input
          label="Current Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password to confirm email change"
        />
      )}

      <Container TwClassName="flex-row justify-end gap-2 mt-4">
        <Button
          TwClassName="p-2 bg-gray-200 rounded-xl text-black border-1 border-gray-200 hover:bg-transparent hover:text-black"
          onClick={() => dispatch(preCloseModal())}
        >
          Cancel
        </Button>
        <Button
          TwClassName="p-2 bg-primary rounded-xl text-white border-1 border-primary hover:bg-transparent hover:text-primary"
          onClick={handleSave}
          disabled={emailChanged && !password}
        >
          {isProfileSaving ? <Loader variant="spinner" color="bg-primary" /> : 'Save'}
        </Button>
      </Container>
    </Container>
  );
};

export default EditProfileModalContent;