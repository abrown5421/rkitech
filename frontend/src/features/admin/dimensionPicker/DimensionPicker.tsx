import React from "react";
import { Box, TextField, FormControl, Select, MenuItem, InputLabel } from "@mui/material";
import type { DimensionPickerProps } from "./dimensionPickerTypes";

const units = ["px", "%", "vw", "vh"] as const;

const DimensionPicker: React.FC<DimensionPickerProps> = ({ value, onChange, labelWidth = "Width", labelHeight = "Height" }) => {
  
  const parseValue = (val: string) => {
    const match = /^([\d.]+)(px|%|vw|vh)?$/.exec(val);
    if (match) return { number: match[1], unit: match[2] || "px" };
    return { number: "", unit: "px" };
  };

  const handleNumberChange = (dimension: "width" | "height", number: string) => {
    const { unit } = parseValue(value[dimension]);
    onChange({ ...value, [dimension]: `${number}${unit}` });
  };

  const handleUnitChange = (dimension: "width" | "height", unit: typeof units[number]) => {
    const { number } = parseValue(value[dimension]);
    onChange({ ...value, [dimension]: `${number}${unit}` });
  };

  const renderInput = (dimension: "width" | "height", label: string) => {
    const { number, unit } = parseValue(value[dimension]);

    return (
      <Box display="flex" alignItems="center" gap={1} flex={1}>
        <TextField
          label={label}
          size="small"
          type="number"
          value={number}
          onChange={(e) => handleNumberChange(dimension, e.target.value)}
          sx={{ flex: "1 1 70px" }}
        />
        <FormControl size="small" sx={{ flex: "0 0 80px" }}>
          <InputLabel>Unit</InputLabel>
          <Select
            value={unit}
            label="Unit"
            onChange={(e) => handleUnitChange(dimension, e.target.value as typeof units[number])}
          >
            {units.map((u) => (
              <MenuItem key={u} value={u}>
                {u}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    );
  };

  return (
    <Box display="flex" flexDirection="row" gap={2}>
      {renderInput("width", labelWidth)}
      {renderInput("height", labelHeight)}
    </Box>
  );
};

export default DimensionPicker;
