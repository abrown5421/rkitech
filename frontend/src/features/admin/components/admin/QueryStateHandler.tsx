import React from 'react';
import { Typography } from '@mui/material';

interface QueryStateHandlerProps {
  isLoading: boolean;
  isError: boolean;
  data: any;
  loadingText?: string;
  errorText?: string;
  children: React.ReactNode;
}

export const QueryStateHandler: React.FC<QueryStateHandlerProps> = ({
  isLoading,
  isError,
  data,
  loadingText = 'Loading...',
  errorText = 'Failed to load data.',
  children,
}) => {
  if (isLoading) {
    return <Typography sx={{ p: 4 }}>{loadingText}</Typography>;
  }

  if (isError || !data) {
    return <Typography sx={{ p: 4 }}>{errorText}</Typography>;
  }

  return <>{children}</>;
};