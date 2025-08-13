import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { useNavigationHook } from '../../../hooks/useNavigationHook';
import { setLoading, setNotLoading } from '../../../app/globalSlices/loading/loadingSlice';
import { openAlert } from '../../../shared/features/alert/alertSlice';
import { getRandomTrianglifyParams } from '../../../shared/components/trianglifyBanner/getRandomTrianglifyParams';
import { signUpUser } from '../../../services/auth/signUpUser';
import { setClientAuthUser } from './clientAuthUserSlice';
import Cookies from 'js-cookie';
import { signInUser } from '../../../services/auth/signInUser';
import Container from '../../../shared/components/container/Container';
import Text from '../../../shared/components/text/Text';
import Input from '../../../shared/components/input/Input';
import Button from '../../../shared/components/button/Button';
import Loader from '../../../shared/components/loader/Loader';
import Icon from '../../../shared/components/icon/Icon';

const ClientAuth: React.FC = () => {
    const dispatch = useAppDispatch();
    const clientNavigation = useNavigationHook();
    const { loading, id } = useAppSelector((state) => state.loading);
    const authUser = useAppSelector((state) => state.authUser);
    const homePageId = useAppSelector((state) => state.homePageId);
    const pages = useAppSelector((state) => state.pages.pages);
    const isLoading = loading && id === 'signInButton';
    const loginComp = pages.find((page) => page.componentKey === 'LoginComp')
    const signUpComp = pages.find((page) => page.componentKey === 'SignUpComp')
    
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

    if (authUser.user) {
        dispatch(clientNavigation('/', 'Home', homePageId.id))
    }
    
    const handleSubmit = async () => {
        dispatch(setLoading({loading: true, id: 'signInButton'}));
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
            dispatch(setNotLoading())
            return;
        }
    
        try {
            if (isSignup) {
                const triBan = getRandomTrianglifyParams();
                const randomizedTrianglifyBanner = {
                    xColors: triBan.xColor,
                    yColors: triBan.yColor,
                    width: 'w-full',
                    height: 250,
                    variance: triBan.variance,
                    cellSize: triBan.cellSize
                }

                const result = await signUpUser(
                    formValues.email,
                    formValues.password,
                    formValues.firstName,
                    formValues.lastName,
                    '',
                    randomizedTrianglifyBanner                    
                );
                if (!result) throw new Error('Failed to sign up');
    
                dispatch(setClientAuthUser({
                    userId: result.userId,
                    email: formValues.email,
                    firstName: formValues.firstName,
                    lastName: formValues.lastName,
                    profileImage: '',
                    userRole: 'User',
                    createdAt: new Date().toISOString(),
                    trianglifyObject: randomizedTrianglifyBanner,
                    bio: '',
                    gender: undefined,
                    phone: '',
                    addressLn1: '',
                    addressLn2: '',
                    addressCity: '',
                    addressState: '',
                    addressPostCode: ''
                }));
                
                Cookies.set('authUser', JSON.stringify({
                    userId: result.userId,
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
                dispatch(setNotLoading())
                setTimeout(() => {clientNavigation('/', 'Home', homePageId.id)();}, 100)
                
            } else {
                const result = await signInUser(formValues.email, formValues.password);

                if (!result) throw new Error('Login failed');

                if (result.userRole === 'Disabled') {
                    throw new Error('This account has been disabled. Please contact an administrator.');
                }
                
                dispatch(setClientAuthUser({
                    userId: result.userId,
                    email: result.email,
                    firstName: result.firstName,
                    lastName: result.lastName,
                    profileImage: result.profileImage,
                    userRole: result.userRole,
                    createdAt: result.createdAt,
                    trianglifyObject: result.trianglifyObject,
                    bio: result.bio,
                    gender: result.gender,
                    phone: result.phone,
                    addressLn1: result.addressLn1,
                    addressLn2: result.addressLn2,
                    addressCity: result.addressCity,
                    addressState: result.addressState,
                    addressPostCode: result.addressPostCode
                }));

                Cookies.set('authUser', JSON.stringify({
                    userId: result.userId,
                }), { expires: 1 });

                dispatch(setNotLoading())
                setTimeout(() => {clientNavigation('/', 'Home', homePageId.id)();}, 100)
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
            dispatch(setNotLoading())
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
            TwClassName="w-full min-h-[calc(100vh-50px)] justify-center items-center"
        >
            <Container TwClassName='w-11/12 md:w-1/3 p-4 bg-white rounded-xl min-h-2/5 flex-col justify-between'>
                <Text text={isSignup ? 'Create Account' : 'Login'} TwClassName="text-xl" />

                {isSignup && (
                    <>
                        <Input
                            label="First Name"
                            value={formValues.firstName}
                            onChange={handleChange('firstName')}
                            error={!!errors.firstName}
                            helperText={errors.firstName}
                            TwClassName='mt-3'
                        />
                        <Input
                            label="Last Name"
                            value={formValues.lastName}
                            onChange={handleChange('lastName')}
                            error={!!errors.lastName}
                            helperText={errors.lastName}
                            TwClassName='mt-3'
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
                    TwClassName='mt-3'
                />

                <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={formValues.password}
                    onChange={handleChange('password')}
                    error={!!errors.password}
                    helperText={errors.password}
                    TwClassName='mt-3'
                    endAdornment={
                        <Icon
                            TwClassName="relative z-50 cursor-pointer"
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
                        TwClassName='mt-3'
                    />
                )}

                <Button TwClassName='mt-3 p-2 bg-primary rounded-xl text-white border-1 border-primary hover:bg-transparent hover:text-primary' onClick={handleSubmit}>
                    {isSignup ? (isLoading ? <Loader variant='spinner' color='bg-white' /> : 'Create Account') : (isLoading ? <Loader variant='spinner' color='bg-white' /> : 'Login')}
                </Button>

                <Button
                    TwClassName="text-sm text-black hover:underline"
                    onClick={() => {
                        isSignup
                            ? clientNavigation('/login', 'Auth', loginComp?.pageID ?? '')()
                            : clientNavigation('/sign-up', 'Auth', signUpComp?.pageID ?? '')()
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

export default ClientAuth;