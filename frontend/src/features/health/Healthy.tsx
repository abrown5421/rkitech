import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';
import type { HealthyProps } from './HealthTypes';

const Healthy: React.FC<HealthyProps> = ({ progress }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      width="100vw"
      height="100vh"
      bgcolor="secondary.main"
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Box sx={{ width: '14rem' }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            color="primary"
            sx={{
              height: 10,
              borderRadius: 5,
            }}
          />
        </Box>

        <Typography
          variant="body2"
          color="primary"
          sx={{ mt: 2, fontWeight: 500 }}
        >
          {progress}%
        </Typography>
      </Box>
    </Box>
  );
};

export default Healthy;
