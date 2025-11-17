import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useGetActiveThemeQuery } from '../../../theme/themeApi';

interface AdminPageLayoutProps {
  title: string;
  onAddNew: () => void;
  children: React.ReactNode;
  addButtonText?: string;
}

export const AdminPageLayout: React.FC<AdminPageLayoutProps> = ({
  title,
  onAddNew,
  children,
  addButtonText = 'Add New',
}) => {
  const { data: theme } = useGetActiveThemeQuery();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 64px)',
        overflow: 'scroll',
        width: '100%',
        boxSizing: 'border-box',
        p: 4,
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" sx={{ fontFamily: 'PrimaryFont' }}>
          {title}
        </Typography>
        <Button
          startIcon={<Add />}
          onClick={onAddNew}
          sx={{
            backgroundColor: theme?.primary.main,
            color: theme?.primary.content,
            border: '1px solid transparent',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: theme?.neutral.main,
              color: theme?.primary.main,
              borderColor: theme?.primary.main,
            },
          }}
        >
          {addButtonText}
        </Button>
      </Box>
      {children}
    </Box>
  );
};