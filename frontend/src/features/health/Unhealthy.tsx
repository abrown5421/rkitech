import React from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';
import type { UnhealthyProps } from './HealthTypes';

const Unhealthy: React.FC<UnhealthyProps> = ({ error }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      width="100vw"
      height="100vh"
      bgcolor="error.main"
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          maxWidth: 400,
          textAlign: 'center',
          borderRadius: 4,
          border: theme => `1px solid ${theme.palette.error.light}`,
          backgroundColor: 'background.paper',
        }}
      >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          mb={2}
        >
          <ErrorOutline sx={{ fontSize: 60, color: 'error.main' }} />
        </Box>

        <Typography variant="h5" fontWeight="bold" color="error.main" mb={1}>
          Yikes! Something went wrong.
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          mb={3}
        >
          {error || 'An unexpected error occurred while loading the application.'}
        </Typography>

        <Button
          variant="outlined"
          color="error"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </Paper>
    </Box>
  );
};

export default Unhealthy;
