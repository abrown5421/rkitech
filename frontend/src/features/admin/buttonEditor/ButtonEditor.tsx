import { Box, FormControl, InputLabel, MenuItem, Select, TextField, Typography, useTheme } from '@mui/material';
import React from 'react';
import ColorPicker from '../colorPicker/ColorPicker';
import { usePropEditor } from '../../../hooks/admin/usePropEditor';
import { useAppDispatch } from '../../../store/hooks';
import { updateDraft } from '../../frontend/renderer/rendererSlice';
import { ActionPicker } from '../actionPicker/ActionPicker';

const ButtonEditor: React.FC = () => {
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const { draft, activeProps, updateProp } = usePropEditor();

    if (!draft) return <Typography>Element not found</Typography>;
    
    const paletteKey = activeProps.color as string;

    const rawColor = theme.palette[paletteKey as keyof typeof theme.palette];

    const themeColorHex =
    typeof rawColor === "object" && rawColor !== null && "main" in rawColor
        ? (rawColor as { main: string }).main
        : "#ffffff";
        
    const variants = [
        "Text", "Contained", "Outlined"
    ];

    return (
        <Box display="flex" flexDirection="column" gap={2}>
            <Box display='flex'  flexDirection='row' gap={1}>
            <FormControl size="small" sx={{ flex: '1' }}>
                <InputLabel>Variant</InputLabel>
                <Select
                    value={activeProps.variant ?? "contained"}
                    label="Variant"
                    onChange={(e) => updateProp("variant", e.target.value)}
                >
                    {variants.map((font) => (
                    <MenuItem key={font} value={font.toLowerCase()}>
                        <Typography>{font}</Typography>
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
            <Box display="flex" flexDirection="row">
                <ColorPicker
                    label="Button Color"
                    themeOnly={true}
                    value={themeColorHex}
                    onChange={(e) => updateProp("color", e)}
                    containerSx={{width: '100%'}}
                />
            </Box>
            <Typography variant="h6">Action:</Typography>
            <ActionPicker
              value={activeProps.action}
              onChange={(newAction) => updateProp("action", newAction)}
            />
        </Box>
    );
};
export default ButtonEditor;
