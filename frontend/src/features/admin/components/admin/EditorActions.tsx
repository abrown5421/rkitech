import React from 'react';
import { Box, Button, CircularProgress } from '@mui/material';
import { useGetActiveThemeQuery } from '../../../theme/themeApi';

interface EditorActionsProps {
  isNew: boolean;
  isChanged: boolean;
  isSaving: boolean;
  onSave: () => void;
  onRevert?: () => void;
  saveText?: string;
  revertText?: string;
}

export const EditorActions: React.FC<EditorActionsProps> = ({
  isNew,
  isChanged,
  isSaving,
  onSave,
  onRevert,
  saveText = 'Save',
  revertText = 'Revert Changes',
}) => {
  const { data: theme } = useGetActiveThemeQuery();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 'auto' }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
        {!isNew && onRevert && (
          <Button
            onClick={onRevert}
            disabled={!isChanged}
            sx={{
              backgroundColor: isChanged ? theme?.secondary.main : '#ccc',
              color: isChanged ? theme?.secondary.content : '#fff',
              border: '1px solid transparent',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: theme?.neutral.main,
                color: theme?.secondary.main,
                borderColor: theme?.secondary.main,
              },
            }}
          >
            {revertText}
          </Button>
        )}

        <Button
          disabled={(!isNew && !isChanged) || isSaving}
          onClick={onSave}
          sx={{
            backgroundColor: (isNew || isChanged) ? theme?.primary.main : '#ccc',
            color: (isNew || isChanged) ? theme?.primary.content : '#fff',
            border: '1px solid transparent',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: theme?.neutral.main,
              color: theme?.primary.main,
              borderColor: theme?.primary.main,
            },
          }}
        >
          {isSaving ? <CircularProgress size={20} /> : saveText}
        </Button>
      </Box>
    </Box>
  );
};