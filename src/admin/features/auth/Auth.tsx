import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { InputField } from '../../../components/InputField/InputField';
import { setAuthenticatedUser } from './authSlice';
import { signInUser } from '../../../services/auth/signInUser';
import Container from '../../../components/container/Container';
import Text from '../../../components/text/Text';
import Button from '../../../components/button/Button';
import { validateEmail } from '../../../utils/validateEmail';
import Loader from '../../../components/loader/Loader';
import type { AnimationObject } from '../../../components/container/containerTypes';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setAlert } from '../../../components/alert/alertSlice';

const Auth: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.admin.adminAuth);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');


  const handleLogin = async () => {
    let valid = true;
    setLoading(true);

    setEmailError('');
    setPasswordError('');

    if (!email) {
      setLoading(false);
      setEmailError('Email is required.');
      valid = false;
    } else if (!validateEmail(email)) {
      setLoading(false);
      setEmailError('Please enter a valid email address.');
      valid = false;
    }

    if (!password) {
      setLoading(false);
      setPasswordError('Password is required.');
      valid = false;
    }

    if (!valid) return;

    const result = await signInUser(email, password, 'admin');

    if (result) {
      dispatch(setAuthenticatedUser(result));
      Cookies.set('adminUserId', result.userId, { expires: 2 }); 
      setLoading(false);
    } else {
      dispatch(setAlert({
        open: true,
        severity: 'error',
        message: 'Login failed. Please check your credentials.',
      }));
      setLoading(false);
    }
  };

  const containerAnimations: AnimationObject = {
      entranceAnimation: 'animate__backInUp',
      exitAnimation: 'animate__backOutDown',
      isEntering: user.authenticatedUser ? false : true
  };
  
  return (
    <Container twClasses={['w-full h-full flex flex-col justify-center items-center']}>
      <Container animationObject={containerAnimations} twClasses={['w-[95%] md:w-[60%] lg:w-[30%] p-6 border rounded-lg shadow-lg space-y-4 bg-gray-50']}>
        <Text text="Login" twClasses={['text-xl font-bold text-center']} />
        <InputField
          label="Email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          error={!!emailError}
          errorText={emailError}
        />

        <InputField
          label="Password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          error={!!passwordError}
          errorText={passwordError}
        />


        <Button
          label={loading ? <Loader variant='pulse' colorName='gray' colorIntensity={50} size={7}/> : "Log In"}
          twClasses={['bg-amber-500 w-full text-white p-2']}
          action={handleLogin}
        />
      </Container>
    </Container>
  );
};

export default Auth;
