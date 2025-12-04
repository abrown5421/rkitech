import React from 'react';
import { Box, TextField, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { updateDraft } from '../../frontend/renderer/rendererSlice';
import ColorPicker from '../colorPicker/ColorPicker';
import BorderPicker from '../borderPicker/BorderPicker';
import SpacingPicker from '../spacingPicker/SpacingPicker';

const TypographyEditor: React.FC = () => {
  const dispatch = useAppDispatch();
  const draft = useAppSelector((state) => state.renderer.draftElement);

  if (!draft) return <Typography>Element not found</Typography>;

  const typographyProps = draft.props ?? {};

  const updateProp = (key: string, value: any) => {
    dispatch(
      updateDraft({
        props: {
          ...typographyProps,
          [key]: value,
        },
      })
    );
  };

  const fontSizes = [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'subtitle1',
    'subtitle2',
    'body1',
    'body2',
    'button',
    'caption',
    'overline'
  ];

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
        <FormControl size="small" sx={{ flex: '1' }}>
          <InputLabel>Size</InputLabel>
          <Select
            value={typographyProps.variant ?? ""}
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

      

      <Typography variant="h6">Color:</Typography>
      <Box display="flex" flexDirection="row" gap={1}>
        <ColorPicker
          label="Background Color"
          value={typographyProps.bgcolor ?? '#ffffff'}
          onChange={(val) => updateProp("bgcolor", val)}
        />
        <ColorPicker
          label="Text Color"
          value={typographyProps.color ?? '#000000'}
          onChange={(val) => updateProp("color", val)}
        />
      </Box>

      <Typography variant="h6">Border:</Typography>
      <BorderPicker
        value={{
          width: parseInt(typographyProps.border?.split(' ')[0] || '1', 10),
          style: typographyProps.border?.split(' ')[1] || 'solid',
          color: typographyProps.border?.split(' ')[2] || '#000000',
        }}
        onChange={(val) =>
          updateProp("border", `${val.width}px ${val.style} ${val.color}`)
        }
      />

      <Typography variant="h6">Spacing:</Typography>
      <SpacingPicker
        margin={typographyProps.sx?.m ?? "0px"}
        padding={typographyProps.p ?? "0px"}
        onChange={(val) => {
          dispatch(updateDraft({
            props: {
              ...typographyProps,
              p: val.padding,
              sx: {
                ...(typographyProps.sx || {}),
                m: val.margin
              }
            }
          }));
        }}
      />
    </Box>
  );
};

export default TypographyEditor;
