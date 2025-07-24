import React, { useState } from 'react';
import Container from '../../../shared/components/container/Container';
import Input from '../../../shared/components/input/Input';
import Button from '../../../shared/components/button/Button';
import type { EditProfileModalProps } from '../modalTypes';

const EditProfileModalContent: React.FC<EditProfileModalProps> = ({
  firstName: initialFirstName,
  lastName: initialLastName,
  email: initialEmail,
  onSave,
  onCancel,
}) => {
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [email, setEmail] = useState(initialEmail);

  return (
    <Container flexDirection="col" height="h-full" justifyContent="between" className="gap-4">
      <Input label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      <Input label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
      <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />

      <Container flexDirection="row" justifyContent="end" className="gap-2 mt-4">
        <Button padding="sm" color="error" onClick={onCancel}>
          Cancel
        </Button>
        <Button padding="sm" color="primary" onClick={() => onSave({ firstName, lastName, email })}>
          Save
        </Button>
      </Container>
    </Container>
  );
};

export default EditProfileModalContent;
