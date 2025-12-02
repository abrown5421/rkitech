import { Box, Toolbar, Typography, IconButton, useTheme } from '@mui/material';
import React from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import logo from '/images/Logo.png';

const Navbar: React.FC = () => {
    const theme = useTheme();

    return (
        <Toolbar
            sx={{ 
                backgroundColor: theme.palette.neutral.main, 
                color: theme.palette.neutral.content, 
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
                <Typography variant='h6' color={theme.palette.primary.main} ml={1} fontFamily="Primary">
                    Rkitech
                </Typography>
            </Box>
            <Box sx={{display: 'flex', alignItems: 'center'}}>
                <IconButton 
                    sx={{ color: theme.palette.neutral.content }}
                >
                    <MenuIcon />
                </IconButton>
            </Box>
        </Toolbar>
    );
};

export default Navbar;
