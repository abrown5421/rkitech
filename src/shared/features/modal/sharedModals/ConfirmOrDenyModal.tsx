import React, { useState } from 'react';
import { fireModalAction, preCloseModal } from '../modalSlice';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import Container from '../../../components/container/Container';
import Button from '../../../components/button/Button';
import Input from '../../../components/input/Input';
import { setNotLoading } from '../../../../app/globalSlices/loading/loadingSlice';

const ConfirmOrDenyModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const modalProps = useAppSelector(state => state.modal.modalProps);
  const actionId = modalProps?.actionId || '';
  const idToDelete = modalProps?.idToDelete || '';
  const requiresAuth = modalProps?.requiresAuth || false;

  const [password, setPassword] = useState('');

  const handleConfirm = () => {
    if (requiresAuth && !password) {
      alert('Please enter your password to continue.');
      return;
    }

    dispatch(fireModalAction({ 
      modalActionFire: true, 
      modalActionId: actionId, 
      password: password,
      idToDelete: idToDelete,
    }));

    dispatch(setNotLoading())
    dispatch(preCloseModal());
  };

  return (
    <Container TwClassName="flex-col gap-4 mt-4">
      {requiresAuth && (
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          label="Enter your password"
        />
      )}
      <Container TwClassName="flex-row justify-end gap-5 mt-4">
        <Button
          onClick={() => {
            dispatch(fireModalAction({ modalActionFire: false, modalActionId: '' }));
            dispatch(setNotLoading())
            dispatch(preCloseModal());
          }}
          TwClassName="min-w-[100px] py-1 px-2 bg-gray-300 rounded-xl text-gray-50 border-1 border-gray-300 hover:bg-transparent hover:text-gray-300 flex-1"
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          TwClassName="min-w-[100px] py-1 px-2 bg-error rounded-xl text-gray-50 border-1 border-error hover:bg-transparent hover:text-error flex-1"
        >
          Confirm
        </Button>
      </Container>
    </Container>
  );
};

export default ConfirmOrDenyModal;
