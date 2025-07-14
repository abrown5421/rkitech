import React, { useEffect, useState } from 'react';
import Container from '../../shared/components/container/Container';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { closeAlert, preCloseAlert } from './alertSlice';
import type { Severity } from './alertTypes';
import Icon from '../../shared/components/icon/Icon';

const severityClasses: Record<Severity, { bg: string; text: string; border: string }> = {
  success: { bg: 'bg-success-faded', text: 'text-success', border: 'border-success' },
  error: { bg: 'bg-error-faded', text: 'text-error', border: 'border-error' },
  warning: { bg: 'bg-warning-faded', text: 'text-warning', border: 'border-warning' },
  info: { bg: 'bg-info-faded', text: 'text-info', border: 'border-info' },
  primary: { bg: 'bg-primary-faded', text: 'text-primary', border: 'border-primary' },
  secondary: { bg: 'bg-secondary-faded', text: 'text-secondary', border: 'border-secondary' },
};

const Alert: React.FC = () => {
  const dispatch = useAppDispatch();
  const alert = useAppSelector((state) => state.alert);
  const { bg, text, border } = severityClasses[alert.severity];
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (alert.open && alert.animation.isEntering) {
      setIsVisible(true);
      timer = setTimeout(() => {
        dispatch(preCloseAlert());
      }, 3000);
    }

    if (!alert.animation.isEntering && alert.open) {
      timer = setTimeout(() => {
        setIsVisible(false);
        dispatch(closeAlert());
      }, 500); 
    }

    return () => clearTimeout(timer);
  }, [alert.open, alert.animation.isEntering, dispatch]);

  const handleClose = () => {
    dispatch(preCloseAlert());
  };

  if (!isVisible && !alert.open) return null;

  return (
    <Container
      padding="md"
      className={`border-l-4 w-1/4 absolute bottom-3 right-3 ${bg} ${text} ${border}`}
      animation={{
        entranceExit: {
          entranceAnimation: alert.animation.entranceAnimation,
          exitAnimation: alert.animation.exitAnimation,
          isEntering: alert.animation.isEntering,
        },
      }}
    >
      <Icon
        name="X"
        cursor="pointer"
        className="absolute top-4 right-4"
        onClick={handleClose}
      />
      {alert.message}
    </Container>
  );
};

export default Alert;
