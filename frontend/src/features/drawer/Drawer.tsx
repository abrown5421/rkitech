import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import AnimBox from '../../components/animBox/AnimBox';
import { Box, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { closeDrawer } from './drawerSlice';
import { useGetActiveThemeQuery } from '../theme/themeApi';
import { ElementRenderer } from '../elements/ElementRenderer';

const Drawer: React.FC = () => {
    const dispatch = useAppDispatch();
    const { data: theme } = useGetActiveThemeQuery();
    const drawer = useAppSelector((state) => state.drawer);

    const [isClosing, setIsClosing] = React.useState(false);

    if (!drawer.open && !isClosing) return null;

    const getDrawerPositionStyles = () => {
        switch (drawer.orientation) {
            case 'right':
                return {
                    top: 0,
                    right: 0,
                    height: '100vh',
                    width: `${drawer.screenPercentage}vw`,
                };
            case 'left':
                return {
                    top: 0,
                    left: 0,
                    height: '100vh',
                    width: `${drawer.screenPercentage}vw`,
                };
            case 'top':
                return {
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: `${drawer.screenPercentage}vw`,
                };
            case 'bottom':
                return {
                    bottom: 0,
                    left: 0,
                    width: '100vw',
                    height: `${drawer.screenPercentage}vw`,
                };
            default:
                return {
                    top: 0,
                    right: 0,
                    height: '100vh',
                    width: '30vw',
                };
        }
    };

    const handleClose = () => {
    setIsClosing(true);

    const duration = 1000; 
    setTimeout(() => {
        dispatch(closeDrawer());
        setIsClosing(false);
    }, duration);
};


    return (
        <AnimBox
            animationObject={{
                entranceAnimation: 'animate__fadeIn',
                exitAnimation: 'animate__fadeOut',
                isEntering: !isClosing,
            }}
            sx={{
                width: '100%', 
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',    
                zIndex: 5,              
                bgcolor: 'rgba(7, 7, 8, 0.6)', 
                position: 'absolute',    
                top: 0                   
            }}
            onClick={handleClose} 
        >
            <AnimBox
                animationObject={{
                    entranceAnimation: drawer.entrance || 'animate__slideInRight',
                    exitAnimation: drawer.exit || 'animate__slideOutRight',
                    isEntering: drawer.open && !isClosing,
                }}
                sx={{
                    position: 'absolute',
                    ...getDrawerPositionStyles(), 
                    bgcolor: drawer.backgroundColor || theme?.neutral.main,
                    boxShadow: 3,
                    overflow: 'auto',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <Box
                    sx={{
                        display: 'flex',     
                        flexDirection: 'column',
                        width: '100%',       
                        height: '100%',      
                        position: 'relative' 
                    }}
                >
                    
                    <Box 
                        sx={{
                            display: 'flex', 
                            flexDirection: 'row',
                            justifyContent: 'space-between', 
                            p: 2    
                        }}
                    >
                        <Typography 
                            sx={{
                                fontSize: '1.25rem', 
                                fontFamily: 'primary-font',
                                color: theme?.neutral.content
                            }}
                        >{drawer.title || ''}</Typography>
                        
                        <IconButton
                            onClick={handleClose}
                            sx={{
                                position: 'absolute',
                                top: 16,
                                right: 16,
                                color: theme?.neutral.content
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                        
                    </Box>
                    <ElementRenderer elementIds={drawer.children} />
                </Box>
            </AnimBox>
        </AnimBox>
    );
};

export default Drawer;  