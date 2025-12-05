import React from 'react';
import { Box, Typography } from '@mui/material';
import ColorPicker from '../colorPicker/ColorPicker';
import BorderPicker from '../borderPicker/BorderPicker';
import SpacingPicker from '../spacingPicker/SpacingPicker';
import DimensionPicker from '../dimensionPicker/DimensionPicker';
import LayoutPicker from '../layoutPicker/LayoutPicker';
import { usePropEditor } from '../../../hooks/admin/usePropEditor';

const BoxEditor: React.FC = () => {
  const { draft, isHoverMode, activeProps, updateProp, updateNestedProp } = usePropEditor();

  if (!draft) return <Typography>Element not found</Typography>;

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {!isHoverMode && (
        <>
          <Typography variant="h6">Layout:</Typography>
          <LayoutPicker
            flexDirection={activeProps.flexDirection ?? "row"}
            justifyContent={activeProps.justifyContent ?? "flex-start"}
            alignItems={activeProps.alignItems ?? "stretch"}
            gap={activeProps.gap ?? "0px"}
            onChange={(changes) => {
              Object.entries(changes).forEach(([key, value]) => {
                updateProp(key, value);
              });
            }}
          />

          <Typography variant="h6">Dimensions:</Typography>
          <DimensionPicker
            value={{
              width: activeProps.width ?? "100px",
              height: activeProps.height ?? "100px"
            }}
            onChange={(val) => {
              updateProp("width", val.width);
              updateProp("height", val.height);
            }}
          />
        </>
      )}

      <Typography variant="h6">Colors:</Typography>
      <Box display="flex" flexDirection="row" gap={1}>
        <ColorPicker
          label="Background"
          value={activeProps.bgcolor ?? '#ffffff'}
          onChange={(val) => updateProp("bgcolor", val)}
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

export default BoxEditor;