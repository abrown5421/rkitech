import { Box, Toolbar, Typography, IconButton } from '@mui/material';
import React from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { useGetActiveThemeQuery } from '../../../theme/themeApi';
import { useAppDispatch } from '../../../../store/hooks';
import logo from '../../../../../public/images/Logo.png';
import { openDrawer } from '../../../drawer/drawerSlice';

const AdminNavbar: React.FC = () => {
    const { data: theme } = useGetActiveThemeQuery();
    const dispatch = useAppDispatch();

    const handleOpenDrawer = () => {
        dispatch(openDrawer({
            open: true,
            screenPercentage: 30,
            orientation: 'right',
            backgroundColor: theme?.neutral.main || '#fff',
            children: ["6910c5b88f42818c65d16166"],
        }));
    };

    return (
        <Toolbar
            sx={{ 
                backgroundColor: theme?.neutral.main, 
                color: theme?.neutral.content, 
                display: 'flex', 
                justifyContent: 'space-between', 
                px: 2,
                zIndex: 5,
                boxShadow: "0 2px 4px rgba(0,0,0,0.15)"
            }}
        >
            <Box sx={{display: 'flex', alignItems: 'center'}}>
                <Box component="img" src={logo} alt="Rkitech Logo" sx={{
                    height: "100%",
                    maxHeight: 48,
                    objectFit: "contain"
                }}/>
                <Typography variant='h6' sx={{fontFamily: "PrimaryFont", color: theme?.primary.main, ml: 1}}>
                    Rkitech
                </Typography>
            </Box>
            <Box sx={{display: 'flex', alignItems: 'center'}}>
                <IconButton 
                    onClick={handleOpenDrawer} 
                    sx={{ color: theme?.neutral.content }}
                >
                    <MenuIcon />
                </IconButton>
            </Box>
        </Toolbar>
    );
};

export default AdminNavbar;
