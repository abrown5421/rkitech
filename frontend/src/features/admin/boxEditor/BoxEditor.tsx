import React from 'react';
import { Box, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import ColorPicker from '../colorPicker/ColorPicker';
import BorderPicker from '../borderPicker/BorderPicker';
import LayoutPicker from '../layoutPicker/LayoutPicker';
import { updateDraft } from '../../frontend/renderer/rendererSlice';
import SpacingPicker from '../spacingPicker/SpacingPicker';

const BoxEditor: React.FC = () => {
  const dispatch = useAppDispatch();
  const draft = useAppSelector((state) => state.renderer.draftElement);

  if (!draft) return <Typography>Element not found</Typography>;

  const boxProps = draft.props ?? {};

  const updateProp = (key: string, value: any) => {
    dispatch(
      updateDraft({
        props: {
          ...boxProps,
          [key]: value,
        },
      })
    );
  };

  const spacingToPx = (val: any) => {
    if (!val) return "0px";
    if (typeof val === "number") return `${val * 8}px`; 
    return val; 
  };

  return (
    <Box display="flex" flexDirection="column" gap="1rem">
      <Typography variant="h6">Layout:</Typography>
      <LayoutPicker
        flexDirection={boxProps.flexDirection}
        justifyContent={boxProps.justifyContent}
        alignItems={boxProps.alignItems}
        gap={boxProps.gap}
        onChange={(val) =>
          dispatch(
            updateDraft({
              props: {
                ...boxProps,
                ...val,
              },
            })
          )
        }
      />

      <Typography variant="h6">Colors:</Typography>
      <Box display="flex" flexDirection="row" gap={1}>
        <ColorPicker
          label="Background Color"
          value={boxProps.bgcolor ?? '#ffffff'}
          onChange={(val) => updateProp('bgcolor', val)}
        />
        <ColorPicker
          label="Text Color"
          value={boxProps.color ?? '#000000'}
          onChange={(val) => updateProp('color', val)}
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
          updateProp('border', `${val.width}px ${val.style} ${val.color}`)
        }
      />

      <Typography variant="h6">Spacing:</Typography>
      <SpacingPicker
        margin={spacingToPx(boxProps.m ?? boxProps.margin)}
        padding={spacingToPx(boxProps.p ?? boxProps.padding)}
        onChange={(val) =>
          dispatch(
            updateDraft({
              props: {
                ...boxProps,
                margin: val.margin,
                padding: val.padding,
                m: undefined, // optional: remove shorthand after editing
                p: undefined,
              },
            })
          )
        }
      />

    </Box>
  );
};

export default BoxEditor;
