import { Box, useTheme } from '@mui/material';
import React from 'react';

const Sidebar: React.FC = () => {
    const theme = useTheme();
    return (
        <Box
            display='flex'
            flexDirection='column'
            bgcolor={theme.palette.neutral3.main} 
            color={theme.palette.neutral3.content}
            boxShadow='0 5px 10px rgba(0,0,0,0.15)'
            zIndex={3}
            flex={2}
            p={4}
        >
            sidebar
        </Box>
    );
};

export default Sidebar;
