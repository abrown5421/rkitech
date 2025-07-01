import React, { useEffect, useState } from 'react';
import type { ModalProps } from './modalTypes';

const Modal: React.FC<ModalProps> = ({
  modalID = '',
  modalTitle = '',
  modalBody = '',
  modalAction,
  onClose,
  twClasses = [],
  secondaryClasses = [],
  ...rest
}) => {
  const [fadeState, setFadeState] = useState<'in' | 'out'>('out');

  useEffect(() => {
    const timeout = setTimeout(() => setFadeState('in'), 10);
    return () => clearTimeout(timeout);
  }, []);

  const requestClose = () => {
    setFadeState('out');
    setTimeout(() => onClose(), 300); 
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      (window as any).cancelCallback?.();
      requestClose();
    }
  };

  return (
    <div
      id={modalID}
      onClick={handleBackdropClick}
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
        fadeState === 'in' ? 'bg-gray-900/75' : ''
      } ${twClasses.join(' ')}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${modalID}-title`}
      {...rest}
    >
      <div
        className={`bg-gray-50 rounded-lg shadow-lg max-w-lg w-full p-6 transform transition-all duration-300 ${
          fadeState === 'in' ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        } ${secondaryClasses.join(' ')}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4">
          <h2 id={`${modalID}-title`} className="text-xl font-semibold">
            {modalTitle}
          </h2>
        </div>

        <div className="mb-6 text-gray-700">{modalBody}</div>

        <div className="flex justify-end space-x-2">{modalAction(requestClose)}</div>
      </div>
    </div>
  );
};

export default Modal;
