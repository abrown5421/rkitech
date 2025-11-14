import React from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
  Box,
} from "@mui/material";
import { entranceOptions, exitOptions, type AnimationPickerProps } from "./animationPickerTypes";
import type { EntranceAnimation, ExitAnimation } from "../animBox/animBoxTypes";

const formatLabel = (anim: string) =>
  anim.replace("animate__", "").replace(/([A-Z])/g, " $1").replace(/\b\w/g, c => c.toUpperCase());

export const AnimationPicker: React.FC<AnimationPickerProps> = ({
  entrance,
  exit,
  onEntChange,
  onExtChange,
  sx,
  inputSx,
}) => {
  return (
    <Box sx={{display: 'flex', flexDirection: 'row', gap: 2, mb: 3, ...sx}}>
        <Box sx={{ flex: 1 }}>
            <FormControl fullWidth>
                <InputLabel>Entrance</InputLabel>
                <Select
                size="small"
                value={entrance}
                onChange={(e: SelectChangeEvent) => onEntChange(e.target.value as EntranceAnimation)}
                label="Entrance"
                sx={inputSx}
                >
                {entranceOptions.map((anim) => (
                    <MenuItem key={anim} value={anim}>
                    {formatLabel(anim)}
                    </MenuItem>
                ))}
                </Select>
            </FormControl>
        </Box>
        <Box sx={{ flex: 1 }}>
            <FormControl fullWidth>
                <InputLabel>Exit</InputLabel>
                <Select
                size="small"
                value={exit}
                onChange={(e: SelectChangeEvent) => onExtChange(e.target.value as ExitAnimation)}
                label="Exit"
                sx={inputSx}
                >
                {exitOptions.map((anim) => (
                    <MenuItem key={anim} value={anim}>
                    {formatLabel(anim)}
                    </MenuItem>
                ))}
                </Select>
            </FormControl>
        </Box>
    </Box>
  );
};
