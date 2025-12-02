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
      bgcolor={theme.palette.error.main ?? '#FF6266'}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          maxWidth: 400,
          textAlign: 'center',
          borderRadius: 4,
          backgroundColor: theme.palette.neutral.main ?? 'F9FAFB',
        }}
      >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          mb={2}
        >
          <ErrorOutline sx={{ fontSize: 60, color: theme.palette.error.main ?? '#FF6266' }} />
        </Box>

        <Typography variant="h5" fontWeight="bold" color={theme.palette.error.main ?? '#FF6266'} mb={1}>
          Yikes! Something went wrong.
        </Typography>

        <Typography
          variant="body1"
          color={theme.palette.neutral.content}
          mb={3}
        >
          {error || 'An unexpected error occurred while loading the application.'}
        </Typography>

        <Button
          variant="outlined"
          onClick={() => window.location.reload()}
          sx={{
            borderColor: theme.palette.error.main ?? '#FF6266',
            color: theme.palette.error.main ?? '#FF6266',
            "&:hover": {
              backgroundColor: theme.palette.error.main ?? '#FF6266',
              color: theme.palette.error.content ?? '#000000', 
            },
          }}
        >
          Retry
        </Button>
      </Paper>
    </Box>
  );
};

export default Unhealthy;
