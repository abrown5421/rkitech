import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { InputField } from '../../../components/InputField/InputField';
import { setAuthenticatedUser } from './authSlice';
import { signInUser } from '../../../services/auth/signInUser';

const Auth: React.FC = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');

  const handleLogin = async () => {
    const result = await signInUser(email, password);

    if (result) {
      dispatch(setAuthenticatedUser(result));
      setErrorText('');
    } else {
      setErrorText('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-lg space-y-4">
      <h2 className="text-xl font-bold text-center">Login</h2>
      <InputField
        label="Email"
        name="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        error={!!errorText}
        errorText={errorText}
      />
      <InputField
        label="Password"
        name="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        error={!!errorText}
      />
      <button
        onClick={handleLogin}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
      >
        Log In
      </button>
    </div>
  );
};

export default Auth;