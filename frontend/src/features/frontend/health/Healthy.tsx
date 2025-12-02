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
            sx={{
              height: 10,
              borderRadius: 5,
              "& .MuiLinearProgress-bar": {
                backgroundColor: theme.palette.primary.main,
              },
              backgroundColor: theme.palette.neutral.main,
            }}
          />
        </Box>

        <Typography
          variant="body2"
          sx={{ mt: 2, fontWeight: 500, color: theme.palette.primary.main }}
        >
          {progress}%
        </Typography>
      </Box>
    </Box>
  );
};

export default Healthy;
