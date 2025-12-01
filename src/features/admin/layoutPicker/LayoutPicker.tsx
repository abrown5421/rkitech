import React from "react";
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import type { LayoutPickerProps } from "./layoutPickerTypes";

const JUSTIFY_OPTIONS = [
  "flex-start",
  "center",
  "flex-end",
  "space-between",
  "space-around",
  "space-evenly",
];

const ALIGN_OPTIONS = [
  "flex-start",
  "center",
  "flex-end",
  "stretch",
  "baseline",
];

const LayoutPicker: React.FC<LayoutPickerProps> = ({
  flexDirection = "row",
  justifyContent = "flex-start",
  alignItems = "stretch",
  gap = "0px",
  onChange,
}) => {
  const numGap = parseInt(gap.replace("px", ""), 10) || 0;

  const handleGapChange = (val: string) => {
    let num = parseInt(val, 10);
    if (isNaN(num)) num = 0;
    num = Math.max(0, Math.min(100, num));
    onChange({ gap: `${num}px` });
  };

  return (
    <>
    <Box display="flex" flexDirection="row" gap={1}>
        <ToggleButtonGroup
            exclusive
            value={flexDirection}
            onChange={(_, v) => v && onChange({ flexDirection: v })}
            size="small"
        >
            <ToggleButton value="row">Row</ToggleButton>
            <ToggleButton value="column">Column</ToggleButton>
        </ToggleButtonGroup>
      
        <TextField
          type="number"
          fullWidth
          size="small"
          label="Gap (px)"
          value={numGap}
          inputProps={{ min: 0, max: 100 }}
          onChange={(e) => handleGapChange(e.target.value)}
        />
    </Box>
    <Box display="flex" flexDirection="row" gap={1}>
        <FormControl fullWidth size="small">
            <InputLabel>Justify Content</InputLabel>
            <Select
            label="Justify Content"
            value={justifyContent}
            onChange={(e) => onChange({ justifyContent: e.target.value })}
            >
            {JUSTIFY_OPTIONS.map((opt) => (
                <MenuItem key={opt} value={opt}>
                {opt}
                </MenuItem>
            ))}
            </Select>
        </FormControl>
        <FormControl fullWidth size="small">
            <InputLabel>Align Items</InputLabel>
            <Select
            label="Align Items"
            value={alignItems}
            onChange={(e) => onChange({ alignItems: e.target.value })}
            >
            {ALIGN_OPTIONS.map((opt) => (
                <MenuItem key={opt} value={opt}>
                {opt}
                </MenuItem>
            ))}
            </Select>
        </FormControl>
    </Box>
    </>
  );
};

export default LayoutPicker;
