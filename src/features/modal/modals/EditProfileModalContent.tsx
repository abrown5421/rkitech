import React, { useState } from 'react';
import Container from '../../../shared/components/container/Container';
import Input from '../../../shared/components/input/Input';
import Button from '../../../shared/components/button/Button';
import type { EditProfileModalProps } from '../modalTypes';
import { useAppSelector } from '../../../app/hooks';
import Loader from '../../../shared/components/loader/Loader';

const EditProfileModalContent: React.FC<EditProfileModalProps> = ({
  firstName: initialFirstName,
  lastName: initialLastName,
  email: initialEmail,
  onSave,
  onCancel,
}) => {
  const { loading, id } = useAppSelector((state) => state.loading);
  const isProfileSaving = loading && id === 'profileSave';

  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState(''); 

  const emailChanged = email !== initialEmail;

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
        <Button TwClassName='p-2 bg-gray-200 rounded-xl text-black border-1 border-gray-200 hover:bg-transparent hover:text-black' onClick={onCancel}>
          Cancel
        </Button>
        <Button
          TwClassName='p-2 bg-primary rounded-xl text-white border-1 border-primary hover:bg-transparent hover:text-primary'
          onClick={() => onSave({ firstName, lastName, email, password })}
          disabled={emailChanged && !password} 
        >
          {isProfileSaving ? <Loader variant="spinner" color="bg-primary" /> : 'Save'}
        </Button>
      </Container>
    </Container>
  );
};

export default EditProfileModalContent;
