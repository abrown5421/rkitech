import { Box, TextField, Typography, Button } from '@mui/material';
import React from 'react';
import { useGetActiveThemeQuery } from '../../../theme/themeApi';

const Auth: React.FC = () => {
    const { data: theme } = useGetActiveThemeQuery();

    return (
        <Box
            sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                p: 2
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    maxWidth: 400,
                    backgroundColor: theme?.neutral.main,
                    color: theme?.neutral.content,
                    p: 4,
                    borderRadius: '15px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                }}
            >
                <Typography 
                    variant="h5" 
                    sx={{ textAlign: 'center', mb: 1, fontWeight: 600 }}
                >
                   Admin Login
                </Typography>

                <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    variant="outlined"
                    InputLabelProps={{ style: { color: theme?.neutral.content } }}
                    InputProps={{
                        style: {
                            color: theme?.neutral.content,
                            borderColor: theme?.neutral.content
                        }
                    }}
                />

                <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    variant="outlined"
                    InputLabelProps={{ style: { color: theme?.neutral.content } }}
                    InputProps={{
                        style: {
                            color: theme?.neutral.content,
                            borderColor: theme?.neutral.content
                        }
                    }}
                />

                <Button
                    fullWidth
                    sx={{
                        backgroundColor: theme?.primary?.main,
                        color: theme?.primary?.content || '#000',
                        fontWeight: 600,
                        py: 1.2,
                        mt: 1,
                        borderRadius: '10px',
                        border: '1px solid transparent',
                        '&:hover': {
                            backgroundColor: theme?.neutral.main,
                            color: theme?.primary.main,
                            border: `1px solid ${theme?.primary.main}`,
                            
                        }
                    }}
                >
                    Sign In
                </Button>
            </Box>
        </Box>
    );
};

export default Auth;
