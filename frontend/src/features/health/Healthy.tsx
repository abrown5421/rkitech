import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';
import type { HealthyProps } from './HealthTypes';
import { useGetActiveThemeQuery } from '../theme/themeApi';

const Healthy: React.FC<HealthyProps> = ({ progress }) => {
  const { data: theme } = useGetActiveThemeQuery();

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      width="100vw"
      height="100vh"
      bgcolor={theme?.neutral.content}
      color={theme?.primary.main}
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
                backgroundColor: theme?.primary.main,
              },
              backgroundColor: theme?.primary.content,
            }}
          />
        </Box>

        <Typography
          variant="body2"
          sx={{ mt: 2, fontWeight: 500 }}
        >
          {progress}%
        </Typography>
      </Box>
    </Box>
  );
};

export default Healthy;
