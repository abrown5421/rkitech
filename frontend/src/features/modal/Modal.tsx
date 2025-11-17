import React from 'react';
import { closeModal } from './modalSlice';
import { modalCallbackRegistry } from "./modalCallbackRegistry";
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import AnimBox from '../../components/animBox/AnimBox';
import { Box, Button, Divider, IconButton, Typography } from '@mui/material';
import { useGetActiveThemeQuery } from '../theme/themeApi';
import { ElementRenderer } from '../elements/ElementRenderer';
import CloseIcon from '@mui/icons-material/Close';
import { darkenHex } from '../../utils/colorUtils';

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
    
    const handleConfirm = () => {
        const cb = modalCallbackRegistry.onConfirm[modal.callbackKey!];
        cb?.();
        handleClose();
    };

    const handleDeny = () => {
        const cb = modalCallbackRegistry.onDeny[modal.callbackKey!];
        cb?.();
        handleClose();
    };

    const renderPrefab = () => {
        switch (modal.prefab) {
            case "confirm":
                return (
                    <Box sx={{ display: "flex", gap: "1rem", mt: "1rem", justifyContent: 'end' }}>
                        <Button 
                            onClick={() => { modal.onConfirm?.(); handleClose(); }}
                            sx={{
                                backgroundColor: theme?.primary.main,
                                color: theme?.primary.content,
                                border: '1px solid transparent',
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                backgroundColor: theme?.neutral.main,
                                color: theme?.primary.main,
                                borderColor: theme?.primary.main,
                                },
                            }}
                        >
                            Confirm
                        </Button>
                    </Box>
                );

            case "confirmDeny":
                return (
                    <Box sx={{ display: "flex", gap: "1rem", mt: "1rem", justifyContent: 'end' }}>
                        <Button 
                            onClick={handleDeny}
                            sx={{
                                backgroundColor: theme?.neutral3.main,
                                color: theme?.neutral3.content,
                                border: '1px solid transparent',
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                backgroundColor: theme?.neutral.main,
                                color: darkenHex(theme?.neutral3.main ?? "#ccc", 0.3),
                                borderColor: darkenHex(theme?.neutral3.main ?? "#ccc", 0.3),
                                },
                            }}
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleConfirm}
                            sx={{
                                backgroundColor: theme?.primary.main,
                                color: theme?.primary.content,
                                border: '1px solid transparent',
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                backgroundColor: theme?.neutral.main,
                                color: theme?.primary.main,
                                borderColor: theme?.primary.main,
                                },
                            }}
                        >
                            Confirm
                        </Button>
                    </Box>
                );

            default:
                return null;
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
                    backgroundColor: modal.backgroundColor ?? theme?.neutral.main,
                    borderRadius: '1rem',
                    p: 4,
                    m: 4,
                    width: '100%',
                    position: 'relative', 
                    '@media (min-width: 768px)': { width: '75%' },
                    '@media (min-width: 1024px)': { width: '33.333%' },
                    '@media (min-width: 1280px)': { width: '50%' },
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
                        fontFamily: 'PrimaryFont',
                        color: theme?.neutral.content,
                    }}
                >
                    {modal.title}
                </Typography>

                <Divider />
                {modal.body && (
                    <Typography
                        variant='body1'
                        sx={{
                            fontFamily: 'SecondaryFont',
                            color: theme?.neutral.content,
                            my: 2
                        }}
                    >
                        {modal.body}
                    </Typography>
                )}
                {modal.prefab
                    ? renderPrefab()
                    : <ElementRenderer elementIds={modal.children ?? []} />
                }
            </AnimBox>
        </AnimBox>
    );
};

export default Modal;
