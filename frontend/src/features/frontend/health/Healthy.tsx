import React from 'react';
import { Box, LinearProgress, Typography, useTheme } from '@mui/material';
import type { HealthyProps } from './HealthTypes';

const Healthy: React.FC<HealthyProps> = ({ progress }) => {
  const theme = useTheme();

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      width="100vw"
      height="100vh"
      bgcolor={theme.palette.neutral3.main}
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
          color='primary'
          fontWeight={700}
          mt={2}
        >
          {progress}%
        </Typography>
      </Box>
    </Box>
  );
};

export default Healthy;
