import React from 'react';
import { Box, TextField, MenuItem, Select, InputLabel, FormControl, type SelectChangeEvent } from '@mui/material';
import ColorPicker from '../colorPicker/ColorPicker';
import type { BorderPickerProps } from './borderPickerTypes';

const borderStyles = [
  'solid',
  'dashed',
  'dotted',
  'double',
  'groove',
  'ridge',
  'inset',
  'outset',
  'none',
  'hidden',
];

const BorderPicker: React.FC<BorderPickerProps> = ({ value, onChange }) => {
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let width = parseInt(e.target.value, 10);
    if (isNaN(width)) width = 1;
    if (width < 1) width = 1;
    if (width > 100) width = 100;
    onChange({ ...value, width });
  };

  const handleStyleChange = (e: SelectChangeEvent<string>) => {
    onChange({ ...value, style: e.target.value });
  };

  const handleColorChange = (color: string) => {
    onChange({ ...value, color });
  };

  return (
    <Box display="flex" flexDirection="row" gap={1} alignItems="center">
      <TextField
        type="number"
        label="Width"
        size="small"
        inputProps={{ min: 1, max: 100 }}
        value={value.width}
        onChange={handleWidthChange}
        sx={{ flex: '0 0 80px' }}
      />

      <FormControl size="small" sx={{ flex: '0 0 120px' }}>
        <InputLabel>Style</InputLabel>
        <Select value={value.style} label="Style" onChange={handleStyleChange}>
          {borderStyles.map((style) => (
            <MenuItem key={style} value={style}>
              {style}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box flex={1}>
        <ColorPicker
          label="Color"
          value={value.color}
          onChange={handleColorChange}
        />
      </Box>
    </Box>
  );
};

export default BorderPicker;
