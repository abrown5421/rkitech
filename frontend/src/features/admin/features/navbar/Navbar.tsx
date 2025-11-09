import { Avatar, Box, IconButton, Toolbar, Typography } from '@mui/material';
import React from 'react';
import { useGetActiveThemeQuery } from '../../../theme/themeApi';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import Logo from '../../../../../public/images/Logo.png';
import { openDrawer } from '../../../drawer/drawerSlice';
import AnimBox from '../../../../components/animBox/AnimBox';

const Navbar: React.FC = () => {
    const dispatch = useAppDispatch();
    const { data: theme } = useGetActiveThemeQuery();
    const adminAuth = useAppSelector((state) => state.adminAuth);

    const handleOpenProfileMenu = () => {
        dispatch(openDrawer({
            open: true,
            screenPercentage: 25,
            orientation: 'right',
            backgroundColor: theme?.neutral.main ?? "#ffffff", 
            children: ["6910c5b88f42818c65d16166"] 
        }))
    }
    
    return (
        <AnimBox
            animationObject={{
                entranceAnimation: 'animate__fadeIn',
                exitAnimation: 'animate__fadeOut',
                isEntering: adminAuth.user ? true : false
            }}
            sx={{
                boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                position: 'relative',
                zIndex: 3,
                display: adminAuth.user ? 'block' : 'none'
            }}
        >
            <Toolbar 
                sx={{
                    backgroundColor: theme?.neutral.main,
                    color: theme?.neutral2.content,
                    display: 'flex',
                    justifyContent: 'space-between',
                    px: 2,
                }}
            >
                <Box display="flex" alignItems="center">
                    <Box
                        component="img"
                        src={Logo}
                        alt="Logo"
                        sx={{ width: 40, height: 40, mr: 1 }}
                    />
                    <Typography
                        variant='h6'
                        sx={{
                            fontFamily: "PrimaryFont",
                            color: theme?.primary.main
                        }}
                    >
                        Rkitech
                    </Typography>
                </Box>

                <Box>
                    <IconButton onClick={handleOpenProfileMenu}>
                        <Avatar alt="User" src={adminAuth.user?.employeeProfileImage} />
                    </IconButton>
                </Box>
            </Toolbar>
        </AnimBox>
    );
};

export default Navbar;
