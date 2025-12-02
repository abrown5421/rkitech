import React from 'react';
import { Box, Paper, Typography, Button, useTheme } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';
import type { UnhealthyProps } from './HealthTypes';

const Unhealthy: React.FC<UnhealthyProps> = ({ error }) => {
  const theme = useTheme();

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      width="100vw"
      height="100vh"
      bgcolor={theme.palette.error.main}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          maxWidth: 400,
          textAlign: 'center',
          borderRadius: 4,
          backgroundColor: theme.palette.neutral.main,
        }}
      >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          mb={2}
          color='error.main' 
        >
          <ErrorOutline />
        </Box>

        <Typography variant="h5" fontWeight="bold" color="error.main" mb={1}>
          Yikes! Something went wrong.
        </Typography>

        <Typography
          variant="body1"
          color="neutral.content"
          mb={3}
        >
          {error || 'An unexpected error occurred while loading the application.'}
        </Typography>

        <Button
          variant="outlined"
          onClick={() => window.location.reload()}
          color="error"
        >
          Retry
        </Button>
      </Paper>
    </Box>
  );
};

export default Unhealthy;
