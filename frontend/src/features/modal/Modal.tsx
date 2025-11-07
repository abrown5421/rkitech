import React from 'react';
import { closeModal } from './modalSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import AnimBox from '../../components/animBox/AnimBox';
import { Divider, IconButton, Typography } from '@mui/material';
import { useGetActiveThemeQuery } from '../theme/themeApi';
import { ElementRenderer } from '../elements/ElementRenderer';
import CloseIcon from '@mui/icons-material/Close';

const Modal: React.FC = () => {
    const dispatch = useAppDispatch();
    const modal = useAppSelector((state) => state.modal);
    const { data: theme } = useGetActiveThemeQuery();

    const [isClosing, setIsClosing] = React.useState(false);
    const [isOverlayClosing, setIsOverlayClosing] = React.useState(false);

    if (!modal.open && !isClosing && !isOverlayClosing) return null;

    const handleClose = async () => {
        setIsClosing(true);
        try {
            setTimeout(() => {
                setIsClosing(false);
                setIsOverlayClosing(true);

                setTimeout(() => {
                    setIsOverlayClosing(false);
                }, 300);                
            }, 500);
        } finally {
            setTimeout(() => {
                dispatch(closeModal())          
            }, 500);
        }
    };
    
    return (
        <AnimBox
            animationObject={{
                entranceAnimation: 'animate__fadeIn',
                exitAnimation: 'animate__fadeOut',
                isEntering: modal.open && !isOverlayClosing,
            }}
            sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 40,
                backgroundColor: 'rgba(3, 7, 18, 0.6)',
                position: 'absolute',
                top: 0,
            }}
            onClick={() => {
                if (modal.closeable) handleClose();
            }}
        >
            <AnimBox
                animationObject={{
                    entranceAnimation: modal.entrance || 'animate__flipInX',
                    exitAnimation: modal.exit || 'animate__flipOutX',
                    isEntering: modal.open && !isClosing,
                }}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: theme?.neutral.main,
                    borderRadius: '1rem',
                    p: 4,
                    m: 4,
                    width: '100%',
                    position: 'relative', 
                    '@media (min-width: 768px)': { width: '50%' },
                    '@media (min-width: 1024px)': { width: '33.333%' },
                    '@media (min-width: 1280px)': { width: '25%' },
                }}
            >
                {modal.closeable && (
                    <IconButton
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            color: theme?.neutral.content,
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                )}

                <Typography
                    sx={{
                        fontSize: '1.25rem',
                        fontFamily: 'primary-font',
                        color: theme?.neutral.content,
                    }}
                >
                    {modal.title}
                </Typography>

                <Divider />
                <ElementRenderer elementIds={modal.children} />
            </AnimBox>
        </AnimBox>
    );
};

export default Modal;
