import React from 'react';
import AnimBox from '../../components/pod/AnimBox';
import src from '../../../public/images/404.png';
import { useNavigation } from '../../hooks/useNavigate';
import { useGetPagesQuery } from '../page/pageApi';
import type { IPage } from '../page/pageTypes';
import { Typography, Button, CircularProgress, Box } from '@mui/material';

const PageNotFound: React.FC = () => {
  const navigate = useNavigation();
  const { data: pages = [], isLoading } = useGetPagesQuery();
  const homePage = pages.find((p) => p.pagePath === '/');

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        minHeight: 'calc(100vh - 50px)',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: 'background.default',
        color: 'text.primary',
        px: 2,
      }}
    >
      {isLoading ? (
        <Box
          sx={{
            width: { xs: '100%', md: '33%' },
            mx: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <AnimBox
          sx={{
            width: { xs: '100%', md: '33%' },
            mx: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
          }}
          animationObject={{
            entranceAnimation: 'animate__fadeInUp',
            exitAnimation: 'animate__fadeOutDown',
            isEntering: true,
          }}
        >
          <Typography
            variant="h1"
            sx={{
              color: 'primary.main',
              fontWeight: 'bold',
              mb: 2,
              fontFamily: 'PrimaryFont',
              fontSize: { xs: '5rem', md: '8rem' },
              lineHeight: 1,
            }}
          >
            404
          </Typography>

          <Box
            component="img"
            src={src}
            alt="Page not found"
            sx={{
              width: '100%',
              maxWidth: 400,
              mb: 3,
              objectFit: 'contain',
            }}
          />

          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              mb: 3,
              color: 'text.secondary',
              fontFamily: 'SecondaryFont',
            }}
          >
            Not all who wander are lost. But you sure are.
          </Typography>

          <Button
            variant="contained"
            color="primary"
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              px: 4,
              py: 1,
              color: 'light.main',
              fontWeight: 'bold',
              fontSize: '1rem',
              boxShadow: 3,
              '&:hover': {
                boxShadow: 6,
              },
            }}
            onClick={() => {
              if (homePage) navigate(homePage as IPage);
            }}
          >
            Go Home
          </Button>
        </AnimBox>
      )}
    </Box>
  );
};

export default PageNotFound;
