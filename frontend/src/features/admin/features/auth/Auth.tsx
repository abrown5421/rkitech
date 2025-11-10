import { Box, TextField, Typography, Button } from '@mui/material';
import React, { useState } from 'react';
import { useGetActiveThemeQuery } from '../../../theme/themeApi';
import { useAppDispatch } from '../../../../store/hooks';
import { setUser } from './authSlice';
import { useLazyLoginEmployeeQuery } from '../../../employees/employeesApi';
import { openAlert } from "../../../alert/alertSlice";
import AnimBox from '../../../../components/animBox/AnimBox';
import Cookies from 'js-cookie';

const Auth: React.FC = () => {
    const { data: theme } = useGetActiveThemeQuery();
    const dispatch = useAppDispatch();

    const [loginEmployee, { isLoading }] = useLazyLoginEmployeeQuery();

    const [animate, setAnimate] = useState<boolean>(true);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const [errors, setErrors] = useState({
        email: '',
        password: '',
        general: '',
    });

    const validate = () => {
        const newErrors = { email: '', password: '', general: '' };
        let isValid = true;

        if (!email.trim()) {
            newErrors.email = 'Email is required.';
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Enter a valid email address.';
            isValid = false;
        }

        if (!password.trim()) {
            newErrors.password = 'Password is required.';
            isValid = false;
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters.';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleLogin = async () => {
        setErrors((prev) => ({ ...prev, general: '' }));

        const isValid = validate();

        if (!isValid) {
            dispatch(
                openAlert({
                    body: "There were errors in your login attempt.",
                    severity: "error",
                    closeable: true,
                    entrance: "animate__fadeInRight",
                    exit: "animate__fadeOutRight",
                    orientation: "bottom-right"
                })
            );

            return;
        }

        const result = await loginEmployee({ email, password });
        
        if (!result?.data) {
            dispatch(
                openAlert({
                    body: "Invalid email or password.",
                    severity: "error",
                    closeable: true,
                    entrance: "animate__fadeInRight",
                    exit: "animate__fadeOutRight",
                    orientation: "bottom-right"
                })
            );

            setErrors({ email: "", password: "", general: "" });
            return;
        }
        setAnimate(false)
        const user = result.data;
        Cookies.set('adminUser', JSON.stringify(user), { expires: 7, sameSite: 'strict' });

        setTimeout(() => {
            dispatch(setUser(user));
        }, 500)
    };

    return (
        <AnimBox
            sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                p: 2
            }}
            animationObject={{
                entranceAnimation: 'animate__fadeInUpBig',
                exitAnimation: 'animate__fadeOutDownBig',
                isEntering: animate
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

                {errors.general && (
                    <Typography sx={{ color: theme?.error?.main || 'red', textAlign: 'center' }}>
                        {errors.general}
                    </Typography>
                )}

                <TextField
                    fullWidth
                    size='small'
                    label="Email"
                    type="email"
                    variant="outlined"
                    value={email}
                    error={!!errors.email}
                    helperText={errors.email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) {
                            setErrors((prev) => ({ ...prev, email: '' }));
                        }
                    }}
                    InputLabelProps={{ style: { color: theme?.neutral.content } }}
                    InputProps={{
                        style: {
                            color: theme?.neutral.content,
                        }
                    }}
                />

                <TextField
                    fullWidth
                    size='small'
                    label="Password"
                    type="password"
                    variant="outlined"
                    value={password}
                    error={!!errors.password}
                    helperText={errors.password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) {
                            setErrors((prev) => ({ ...prev, password: '' }));
                        }
                    }}
                    InputLabelProps={{ style: { color: theme?.neutral.content } }}
                    InputProps={{
                        style: {
                            color: theme?.neutral.content,
                        }
                    }}
                />

                

                <Button
                    fullWidth
                    disabled={isLoading}
                    onClick={handleLogin}
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
                        },
                        opacity: isLoading ? 0.7 : 1,
                    }}
                >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
            </Box>
        </AnimBox>
    );
};

export default Auth;
