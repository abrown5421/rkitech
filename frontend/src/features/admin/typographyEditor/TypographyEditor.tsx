import React from 'react';
import { Box, TextField, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useAppDispatch } from '../../../store/hooks';
import { updateDraft } from '../../frontend/renderer/rendererSlice';
import ColorPicker from '../colorPicker/ColorPicker';
import BorderPicker from '../borderPicker/BorderPicker';
import SpacingPicker from '../spacingPicker/SpacingPicker';
import { usePropEditor } from '../../../hooks/admin/usePropEditor';

const TypographyEditor: React.FC = () => {
  const dispatch = useAppDispatch();
  const { draft, isHoverMode, activeProps, updateProp, updateNestedProp } = usePropEditor();

  if (!draft) return <Typography>Element not found</Typography>;

  const fontSizes = [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'subtitle1', 'subtitle2', 'body1', 'body2',
    'button', 'caption', 'overline'
  ];

  const fonts = [
    "Primary", "Secondary", "Roboto", "Arial", "Verdana",
    "Tahoma", "Trebuchet MS", "Times New Roman", "Georgia",
    "Garamond", "Courier New", "Brush Script MT",
  ];

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {!isHoverMode && (
        <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
          <FormControl size="small" sx={{ flex: '1' }}>
            <InputLabel>Font</InputLabel>
            <Select
              value={activeProps.fontFamily ?? ""}
              label="Font"
              onChange={(e) => updateProp("fontFamily", e.target.value)}
            >
              {fonts.map((font) => (
                <MenuItem key={font} value={font}>
                  <Typography sx={{ fontFamily: font }}>{font}</Typography>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ flex: '1' }}>
            <InputLabel>Size</InputLabel>
            <Select
              value={activeProps.variant ?? ""}
              label="Style"
              onChange={(e) => updateProp("variant", e.target.value)}
            >
              {fontSizes.map((style) => (
                <MenuItem key={style} value={style}>
                  <Typography>{style}</Typography>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Text"
            size="small"
            value={draft.childText ?? ""}
            fullWidth
            sx={{flex: '3'}}
            onChange={(e) => dispatch(updateDraft({ childText: e.target.value }))}
          />
        </Box>
      )}

      <Typography variant="h6">Color:</Typography>
      <Box display="flex" flexDirection="row" gap={1}>
        <ColorPicker
          label="Background Color"
          value={activeProps.bgcolor ?? '#ffffff'}
          onChange={(val) => updateProp("bgcolor", val)}
        />
        <ColorPicker
          label="Text Color"
          value={activeProps.color ?? '#000000'}
          onChange={(val) => updateProp("color", val)}
        />
      </Box>

      <Typography variant="h6">Border:</Typography>
      <BorderPicker
        value={{
          width: parseInt(activeProps.border?.split(' ')[0] || '1', 10),
          style: activeProps.border?.split(' ')[1] || 'solid',
          color: activeProps.border?.split(' ')[2] || '#000000',
        }}
        onChange={(val) =>
          updateProp("border", `${val.width}px ${val.style} ${val.color}`)
        }
      />

      <Typography variant="h6">Spacing:</Typography>
      <SpacingPicker
        margin={activeProps.sx?.m ?? activeProps.m ?? "0px"}
        padding={activeProps.p ?? "0px"}
        onChange={(val) => {
          updateProp("p", val.padding);
          updateNestedProp(['sx', 'm'], val.margin);
        }}
      />
    </Box>
  );
};

export default TypographyEditor;