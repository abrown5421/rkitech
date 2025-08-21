import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { closeAlert, preCloseAlert } from './alertSlice';
import Container from '../../components/container/Container';
import Icon from '../../components/icon/Icon';
import type { Severity } from './alertTypes';

const severityClasses: Record<Severity, { bg: string; text: string; border: string }> = {
  success: { bg: 'bg-success-faded', text: 'text-success', border: 'border-success' },
  error: { bg: 'bg-error-faded', text: 'text-error', border: 'border-error' },
  warning: { bg: 'bg-warning-faded', text: 'text-warning', border: 'border-warning' },
  info: { bg: 'bg-info-faded', text: 'text-info', border: 'border-info' },
  primary: { bg: 'bg-amber-500-faded', text: 'text-amber-500', border: 'border-primary' },
  secondary: { bg: 'bg-secondary-faded', text: 'text-secondary', border: 'border-secondary' },
};

const Alert: React.FC = () => {
  const dispatch = useAppDispatch();
  const alert = useAppSelector((state) => state.alert);
  const { bg, text, border } = severityClasses[alert.alertSeverity];
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (alert.alertOpen && alert.alertAnimation.isEntering) {
      setIsVisible(true);
      timer = setTimeout(() => {
        dispatch(preCloseAlert());
      }, 3000);
    }

    if (!alert.alertAnimation.isEntering && alert.alertOpen) {
      timer = setTimeout(() => {
        setIsVisible(false);
        dispatch(closeAlert());
      }, 500); 
    }

    return () => clearTimeout(timer);
  }, [alert.alertOpen, alert.alertAnimation.isEntering, dispatch]);

  const handleClose = () => {
    dispatch(preCloseAlert());
  };

  if (!isVisible && !alert.alertOpen) return null;

  return (
    <Container
      TwClassName={`p-4 border-l-4 md:w-1/4 w-3/4  absolute bottom-3 right-3 ${text} ${border} ${bg}`}
      animation={{
        entranceExit: {
          entranceAnimation: alert.alertAnimation.entranceAnimation,
          exitAnimation: alert.alertAnimation.exitAnimation,
          isEntering: alert.alertAnimation.isEntering,
        },
      }}
    >
      <Icon color="text-gray-900"
        name="X"
        cursor="pointer"
        TwClassName="absolute top-4 right-4"
        onClick={handleClose}
      />
      {alert.alertMessage}
    </Container>
  );
};

export default Alert;
