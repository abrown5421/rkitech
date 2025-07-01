import React, { useEffect } from 'react';
import type { AlertProps, Severity } from './alertTypes';
import { useAppDispatch } from '../../store/hooks';
import { closeAlert } from './alertSlice';

const severityColors: Record<Severity, { bg: string; border: string }> = {
    success: { bg: '#d4edda', border: '#28a745' },
    error: { bg: '#f8d7da', border: '#dc3545' },
    warning: { bg: '#fff3cd', border: '#ffc107' },
    info: { bg: '#d1ecf1', border: '#17a2b8' },
};

const Alert: React.FC<AlertProps> = ({ open, severity, message, ...rest }) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (open) {
        const timer = setTimeout(() => {
            dispatch(closeAlert());
        }, 3000); 
        return () => clearTimeout(timer);
        }
    }, [open, dispatch]);

    if (!open) return null;

    const { bg, border } = severityColors[severity];

    return (
        <div
            style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                backgroundColor: bg,
                border: `1px solid ${border}`,
                padding: '12px 20px',
                borderRadius: '8px',
                color: '#000',
                minWidth: '250px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                zIndex: 9999,
                transition: 'opacity 0.3s ease',
            }}
            {...rest}
        >
            {message}
        </div>
    );
};

export default Alert;

