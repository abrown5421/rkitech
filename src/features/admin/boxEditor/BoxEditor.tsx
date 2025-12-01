import React from 'react';
import { Box, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { updateBoxProps } from './boxEditorSlice';
import ColorPicker from '../colorPicker/ColorPicker';
import BorderPicker from '../borderPicker/BorderPicker';
import SpacingPicker from '../spacingPicker/SpacingPicker';
import LayoutPicker from '../layoutPicker/LayoutPicker';

const BoxEditor: React.FC = () => {
  const boxProps = useAppSelector((state) => state.boxEditor);
  const dispatch = useAppDispatch();

  const handleChange = (key: keyof typeof boxProps, value: any) => {
    dispatch(updateBoxProps({ [key]: value }));
  };

  return (
    <Box display="flex" flexDirection="column" gap="1rem">
      <Typography variant="h6">Layout:</Typography>
      <LayoutPicker
        flexDirection={boxProps.flexDirection}
        justifyContent={boxProps.justifyContent}
        alignItems={boxProps.alignItems}
        gap={boxProps.gap}
        onChange={(val) => dispatch(updateBoxProps(val))}
      />

      <Typography variant="h6">Colors:</Typography>
      <Box display="flex" flexDirection="row" gap={1}>
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
        
      <Typography variant="h6">Spacing:</Typography>
        <SpacingPicker
          margin={boxProps.m ?? "0px"}
          padding={boxProps.p ?? "0px"}
          onChange={(val) => {
            handleChange("m", val.margin);
            handleChange("p", val.padding);
          }}
        />
    </Box>
  );
};

export default BoxEditor;
