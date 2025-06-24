import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { closeModal } from './modalSlice';
import Modal from './Modal';
import Button from '../button/Button';

const getModalAction = (id: string, requestClose: () => void) => {
  switch (id) {
    case 'confirmOrDeny':
      return (
        <>
          <Button
            label="Cancel"
            action={() => {
              requestClose();
              (window as any).cancelCallback?.();
            }}
            twClasses={["pt-2 pr-4 pb-2 pl-4 bg-gray-300 rounded"]}
          />
          <Button
            label="Confirm"
            action={async () => {
              requestClose();
              await (window as any).confirmCallback?.();
            }}
            twClasses={["pt-2 pr-4 pb-2 pl-4 bg-amber-500 text-gray-50 rounded"]}
          />
        </>
      );
    default:
      return null;
  }
};

const GlobalModal = () => {
  const dispatch = useAppDispatch();
  const modal = useAppSelector((state) => state.modal);

  if (!modal.open) return null;

  return (
    <Modal
      modalID={modal.modalID}
      modalTitle={modal.modalTitle}
      modalBody={modal.modalBody}
      modalAction={(requestClose) => getModalAction(modal.modalID, requestClose)}
      onClose={() => dispatch(closeModal())}
      twClasses={modal.twClasses}
      secondaryClasses={modal.secondaryClasses}
    />
  );
};

export default GlobalModal;
