import React, { useEffect, useState } from 'react';
import Container from '../../shared/components/container/Container';
import Text from '../../shared/components/text/Text';
import Icon from '../../shared/components/icon/Icon';
import Input from '../../shared/components/input/Input';
import Button from '../../shared/components/button/Button';
import { useNavigationHook } from '../../hooks/useNavigationHook';
import { useAppDispatch } from '../../app/hooks';
import { openAlert } from '../alert/alertSlice';
import { setAuthUser } from './authUserSlice';
import { signUpUser } from '../../services/auth/signUpUser';
import { signInUser } from '../../services/auth/signInUser';
import Cookies from 'js-cookie';

const Auth: React.FC = () => {
    const dispatch = useAppDispatch();
    const clientNavigation = useNavigationHook();
    const [isSignup, setIsSignup] = useState(false);
    const [formValues, setFormValues] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues((prev) => ({ ...prev, [field]: e.target.value }));
        setErrors((prev) => ({ ...prev, [field]: '' }));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (isSignup) {
            if (!formValues.firstName.trim()) newErrors.firstName = 'First name is required';
            if (!formValues.lastName.trim()) newErrors.lastName = 'Last name is required';
        }

        if (!formValues.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formValues.password) {
            newErrors.password = 'Password is required';
        } else if (formValues.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (isSignup && formValues.confirmPassword !== formValues.password) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            dispatch(openAlert({
                alertOpen: true,
                alertSeverity: 'error',
                alertMessage: `Please fix the errors in the ${isSignup ? 'sign up' : 'login'} form.`,
                alertAnimation: {
                    entranceAnimation: 'animate__fadeInRight animate__faster',
                    exitAnimation: 'animate__fadeOutRight animate__faster',
                    isEntering: true,
                }
            }));
            return;
        }
    
        try {
            if (isSignup) {
                const result = await signUpUser(
                    formValues.email,
                    formValues.password,
                    formValues.firstName,
                    formValues.lastName,
                    ''
                );
    
                if (!result) throw new Error('Failed to sign up');
    
                dispatch(setAuthUser({
                    userId: result.userId,
                    email: formValues.email,
                    firstName: formValues.firstName,
                    lastName: formValues.lastName,
                    profileImage: '',
                    userRole: 'User',
                    createdAt: new Date().toISOString(),
                }));
                
                Cookies.set('authUser', JSON.stringify({
                    userId: result.userId,
                    email: result.email,
                    firstName: result.firstName,
                    lastName: result.lastName,
                    profileImage: '',
                    userRole: result.userRole,
                    createdAt: result.createdAt,
                }), { expires: 1 });

                dispatch(openAlert({
                    alertOpen: true,
                    alertSeverity: 'success',
                    alertMessage: 'Account created successfully!',
                    alertAnimation: {
                        entranceAnimation: 'animate__fadeInRight animate__faster',
                        exitAnimation: 'animate__fadeOutRight animate__faster',
                        isEntering: true,
                    }
                }));
    
                clientNavigation('/', 'Home', 'homePage')();
    
            } else {
                const result = await signInUser(formValues.email, formValues.password);

                if (!result) throw new Error('Login failed');

                dispatch(setAuthUser({
                    userId: result.userId,
                    email: result.email,
                    firstName: result.firstName,
                    lastName: result.lastName,
                    profileImage: '',
                    userRole: result.userRole,
                    createdAt: result.createdAt,
                }));
                
                Cookies.set('authUser', JSON.stringify({
                    userId: result.userId,
                    email: formValues.email,
                    firstName: formValues.firstName,
                    lastName: formValues.lastName,
                    profileImage: '',
                    userRole: 'User',
                    createdAt: new Date().toISOString(),
                }), { expires: 1 });

                dispatch(openAlert({
                    alertOpen: true,
                    alertSeverity: 'success',
                    alertMessage: 'Login successful!',
                    alertAnimation: {
                        entranceAnimation: 'animate__fadeInRight animate__faster',
                        exitAnimation: 'animate__fadeOutRight animate__faster',
                        isEntering: true,
                    }
                }));
    
                clientNavigation('/', 'Home', 'homePage')();
            }
        } catch (err: any) {
            dispatch(openAlert({
                alertOpen: true,
                alertSeverity: 'error',
                alertMessage: err.message || 'An error occurred. Please try again.',
                alertAnimation: {
                    entranceAnimation: 'animate__fadeInRight animate__faster',
                    exitAnimation: 'animate__fadeOutRight animate__faster',
                    isEntering: true,
                }
            }));
        }
    };
    
    useEffect(()=>{
        if (location.pathname === '/sign-up') {
            setIsSignup(true)
        } else {
            setIsSignup(false)
        }
    }, [])

    return (
        <Container
            width="w-full"
            height="h-full"
            justifyContent="center"
            alignItems="center"
        >
            <Container width='w-11/12 md:w-1/3' height='min-h-1/2' padding='md' bgColor='bg-white' className='rounded-xl' flexDirection='col' justifyContent='between'>
                <Text text={isSignup ? 'Create Account' : 'Login'} size="xl" />

                {isSignup && (
                    <>
                        <Input
                            label="First Name"
                            value={formValues.firstName}
                            onChange={handleChange('firstName')}
                            error={!!errors.firstName}
                            helperText={errors.firstName}
                            className='mt-3'
                        />
                        <Input
                            label="Last Name"
                            value={formValues.lastName}
                            onChange={handleChange('lastName')}
                            error={!!errors.lastName}
                            helperText={errors.lastName}
                            className='mt-3'
                        />
                    </>
                )}

                <Input
                    label="Email"
                    type="email"
                    value={formValues.email}
                    onChange={handleChange('email')}
                    error={!!errors.email}
                    helperText={errors.email}
                    className='mt-3'
                />

                <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={formValues.password}
                    onChange={handleChange('password')}
                    error={!!errors.password}
                    helperText={errors.password}
                    className='mt-3'
                    endAdornment={
                        <Icon
                            className="relative z-50 cursor-pointer"
                            name={showPassword ? 'EyeOff' : 'Eye'}
                            onClick={() => setShowPassword((prev) => !prev)}
                        />
                    }
                />

                {isSignup && (
                    <Input
                        label="Confirm Password"
                        type="password"
                        value={formValues.confirmPassword}
                        onChange={handleChange('confirmPassword')}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                        className='mt-3'
                    />
                )}

                <Button className='mt-3' padding="sm" onClick={handleSubmit}>
                    {isSignup ? 'Create Account' : 'Login'}
                </Button>

                <Button
                    padding="none"
                    variant="ghost"
                    className="text-sm text-blue-600 hover:underline"
                    onClick={() => {
                        isSignup
                            ? clientNavigation('/login', 'Auth', 'authenticationPage')()
                            : clientNavigation('/sign-up', 'Auth', 'authenticationPage')()
                        setErrors({});
                        setTimeout(() => {
                            setFormValues({
                                firstName: '',
                                lastName: '',
                                email: '',
                                password: '',
                                confirmPassword: '',
                            });
                            setIsSignup((prev) => !prev);
                        }, 150)
                    }}
                >
                    {isSignup
                        ? 'Already have an account? Login'
                        : "Don't have an account? Sign up"}
                </Button>
            </Container>
        </Container>
    );
};

export default Auth;
