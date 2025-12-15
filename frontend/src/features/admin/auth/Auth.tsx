import React, { useState } from 'react';
import {
  Box, Button, TextField, Typography,
  useTheme, IconButton, InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAppDispatch } from '../../../store/hooks';
import { openAlert } from '../../frontend/alert/alertSlice';
import { useLoginMutation } from '../../frontend/user/userApi';
import { setUser } from './authSlice';
import { useNavigation } from '../../../hooks/useNavigate';
import { useGetPagesQuery } from '../../frontend/page/pageApi';

const Auth: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigation();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const { data: pages } = useGetPagesQuery();
  const dashboard = pages?.find((p) => p.pageUniqueId === "page_id_admin_dash");

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const showErrorAlert = (message = 'There was a problem logging you in.') => {
    dispatch(
      openAlert({
        severity: 'error',
        body: message,
        closeable: true,
        orientation: 'bottom-right',
        entrance: 'animate__fadeInRight',
        exit: 'animate__fadeOutRight',
      })
    );
  };

  const handleSubmit = async () => {
    let hasError = false;
    setEmailError('');
    setPasswordError('');

    if (!email) {
      setEmailError('Email is required');
      hasError = true;
    } else if (!email.includes('@') || !email.includes('.')) {
      setEmailError('Email must contain an @ sign and a period');
      hasError = true;
    }

    if (!password) {
      setPasswordError('Password is required');
      hasError = true;
    }

    if (hasError) {
      showErrorAlert();
      return;
    }

    try {
      const user = await login({ email, password }).unwrap();
      dispatch(setUser(user));
      if (dashboard) {
        navigate(dashboard);
      } else {
        showErrorAlert('Dashboard page not found.');
      }
    } catch (err: any) {
      showErrorAlert(err?.data?.message || 'There was a problem logging you in.');
    }
  };

  return (
    <Box display="flex" width="100%" height="100vh" justifyContent="center" alignItems="center">
      <Box
        bgcolor={theme.palette.neutral.main}
        color={theme.palette.neutral.content}
        borderRadius="15px"
        padding={2}
        sx={{ width: { xs: '95%', sm: '50%', md: '400px' } }}
      >
        <Typography variant="h6" textAlign="center" mb={2}>Login</Typography>

        <TextField
          label="Email" size="small" fullWidth
          value={email} onChange={(e) => setEmail(e.target.value)}
          error={!!emailError} helperText={emailError}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Password" size="small" fullWidth
          type={showPassword ? 'text' : 'password'}
          value={password} onChange={(e) => setPassword(e.target.value)}
          error={!!passwordError} helperText={passwordError}
          sx={{ mb: 2 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(prev => !prev)} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        <Button variant="contained" color="primary" fullWidth onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
      </Box>
    </Box>
  );
};

export default Auth;
