import React from 'react';
import { Box, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import ColorPicker from '../colorPicker/ColorPicker';
import BorderPicker from '../borderPicker/BorderPicker';
import SpacingPicker from '../spacingPicker/SpacingPicker';
import LayoutPicker from '../layoutPicker/LayoutPicker';
import { updateElementProps } from '../../frontend/renderer/rendererSlice';

const TypographyEditor: React.FC<{ elementId: string }> = ({ elementId }) => {
  const element = useAppSelector((state) => {
    const findById = (el: any): any => {
      if (el._id === elementId) return el;
      for (const child of el.children || []) {
        const found = findById(child);
        if (found) return found;
      }
    };
    return findById(state.renderer.root);
  });

  const dispatch = useAppDispatch();

  if (!element) return <Typography>Element not found</Typography>;

  const boxProps = element.props;

  const handleChange = (key: string, value: any) => {
    dispatch(updateElementProps({ _id: elementId, props: { [key]: value } }));
  };

  return (
    <Box display="flex" flexDirection="column" gap="1rem">
      Typo
    </Box>
  );
};

export default TypographyEditor;
