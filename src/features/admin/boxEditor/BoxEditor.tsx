import React from 'react';
import { Box, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { updateBoxProps } from './boxEditorSlice';
import ColorPicker from '../colorPicker/ColorPicker';
import BorderPicker from '../borderPicker/BorderPicker';

const BoxEditor: React.FC = () => {
  const boxProps = useAppSelector((state) => state.boxEditor);
  const dispatch = useAppDispatch();

  const handleChange = (key: keyof typeof boxProps, value: any) => {
    dispatch(updateBoxProps({ [key]: value }));
  };

  return (
    <Box display="flex" flexDirection="column" gap="1rem">
      <Typography variant="h6">Colors:</Typography>
      <Box display="flex" flexDirection="row" gap="1rem">
        <ColorPicker
          label="Background Color"
          value={boxProps.bgcolor ?? '#ffffff'}
          onChange={(val) => handleChange('bgcolor', val)}
        />
        <ColorPicker
          label="Text Color"
          value={boxProps.color ?? '#000000'}
          onChange={(val) => handleChange('color', val)}
        />
      </Box>

      <Typography variant="h6">Border:</Typography>
        <BorderPicker
          value={{
            width: parseInt(boxProps.border?.split(' ')[0] || '1', 10),
            style: boxProps.border?.split(' ')[1] || 'solid',
            color: boxProps.border?.split(' ')[2] || '#000000',
          }}
          onChange={(val) =>
            handleChange('border', `${val.width}px ${val.style} ${val.color}`)
          }
        />
    </Box>
  );
};

export default BoxEditor;
