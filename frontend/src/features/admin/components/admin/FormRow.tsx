import React from 'react';
import { Box } from '@mui/material';

interface FormRowProps {
  children: React.ReactNode;
  gap?: number;
  mb?: number;
}

export const FormRow: React.FC<FormRowProps> = ({ children, gap = 2, mb = 3 }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', gap, mb }}>
      {children}
    </Box>
  );
};