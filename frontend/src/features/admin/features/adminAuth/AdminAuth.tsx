import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';
import { useGetActiveThemeQuery } from '../../../theme/themeApi';
import { useDispatch } from 'react-redux';
import { useLazyLoginEmployeeQuery } from '../../../employees/employeesApi';
import { setAdminUser } from './adminAuthSlice';
import { openAlert } from '../../../alert/alertSlice';
import AnimBox from '../../../../components/animBox/AnimBox';
import { useNavigation } from '../../../../hooks/useNavigate';
import { useGetPagesQuery } from '../../../page/pageApi';
import type { IPage } from '../../../page/pageTypes';

const AdminAuth: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigation();
  const { data: theme } = useGetActiveThemeQuery();
  const { data: pages } = useGetPagesQuery();

  const [triggerLogin, { isFetching }] = useLazyLoginEmployeeQuery();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [isAnimating, setIsAnimating] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    console.log(pages)
    const dashboardPage = pages?.find((p) => p.pageName === 'AdminDashPage')
    const { email, password } = form;

    const result = await triggerLogin({ email, password });

    if (!result.data) {
      dispatch(
        openAlert({
          body: 'There was a problem logging you in',
          closeable: true,
          severity: 'error',
          orientation: 'bottom-right'
        })
      );
      return;
    }
    setIsAnimating(false)
    
    setTimeout(() => {
      console.log(dashboardPage)
      navigate(dashboardPage as IPage)
      dispatch(setAdminUser(result.data ?? null));
    }, 500)
    
  };

  return (
    <AnimBox
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        minHeight: 'calc(100vh - 64px)',
        width: '100%',
      }}
      animationObject={{
          entranceAnimation: "animate__fadeInUp",
          exitAnimation: "animate__fadeOutDown",
          isEntering: isAnimating,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          backgroundColor: theme?.neutral.main,
          color: theme?.neutral.content,
          borderRadius: '15px',
          padding: 3,
          width: {
            xs: '95%',
            md: '40%',
          },
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          <Typography
            variant="h5"
            textAlign="center"
            sx={{ mb: 1, fontFamily: 'PrimaryFont' }}
          >
            Admin Panel Login
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            fullWidth
            size="small"
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            variant="outlined"
          />

          <TextField
            fullWidth
            size="small"
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            variant="outlined"
          />

          <Button
            type="submit"
            fullWidth
            disabled={isFetching}
            sx={{
              mt: 1,
              backgroundColor: theme?.primary.main,
              border: '1px solid transparent',
              color: theme?.primary.content,
              '&:hover': {
                backgroundColor: theme?.neutral.main,
                color: theme?.primary.main,
                borderColor: theme?.primary.main,
              },
            }}
          >
            {isFetching ? 'Signing In...' : 'Sign In'}
          </Button>
        </Box>
      </Box>
    </AnimBox>
  );
};

export default AdminAuth;
