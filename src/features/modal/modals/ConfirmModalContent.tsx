import React from 'react';
import Container from '../../../shared/components/container/Container';
import Button from '../../../shared/components/button/Button';
import Text from '../../../shared/components/text/Text';

interface ConfirmModalProps {
  message?: string;
  onConfirm: () => void;
  onDeny: () => void;
}

const ConfirmModalContent: React.FC<ConfirmModalProps> = ({ message = 'Are you sure?', onConfirm, onDeny }) => {
  return (
    <Container TwClassName="flex-col h-full justify-between">
      <Text TwClassName="text-md" text={message} />
      <Container TwClassName="flex-row w-full justify-end gap-2">
        <Button padding="sm" color="error" onClick={onDeny}>Deny</Button>
        <Button padding="sm" color="primary" onClick={onConfirm}>Confirm</Button>
      </Container>
    </Container>
  );
};

export default ConfirmModalContent;
