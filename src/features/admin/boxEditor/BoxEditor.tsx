import React from 'react';
import { updateBoxProps } from './boxEditorSlice';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { Box, Typography } from '@mui/material';
import ColorPicker from '../colorPicker/ColorPicker';

const BoxEditor: React.FC = () => {
  const boxProps = useAppSelector((state) => state.boxEditor);
  const dispatch = useAppDispatch();

  const handleChange = (key: keyof typeof boxProps, value: string) => {
    dispatch(updateBoxProps({ [key]: value }));
  };

  return (
    <Box display="flex" flexDirection="column" gap='1rem'>
      <Typography variant='h6'>Colors:</Typography>
      <Box display="flex" flexDirection="row" gap='1rem'>
        <Box display="flex" flexDirection="column" flex={1}>
          <ColorPicker 
            label="Background Color" 
            value={boxProps.bgcolor ?? "#ffffff"} 
            onChange={(val) => handleChange("bgcolor", val)} 
          />
        </Box>
        <Box display="flex" flexDirection="column" flex={1}>
          <ColorPicker 
            label="Text Color" 
            value={boxProps.color ?? "#000000"} 
            onChange={(val) => handleChange("color", val)} 
          />
        </Box>
      </Box>
    </Box>
  );
};

export default BoxEditor;
