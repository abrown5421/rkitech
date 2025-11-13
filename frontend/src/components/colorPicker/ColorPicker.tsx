import React, { useState, useRef } from "react";
import { Box, TextField, InputAdornment, Popper, Paper, ClickAwayListener } from "@mui/material";
import { HexColorPicker } from "react-colorful";
import type { ColorPickerProps } from "./colorPickerTypes";

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange, sx, inputSx }) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => setOpen((prev) => !prev);
  const handleClickAway = () => setOpen(false);

  const handleColorChange = (newColor: string) => {
    onChange(newColor);
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ ...sx }}>
        <TextField
          fullWidth
          inputRef={anchorRef}
          value={color}
          onChange={(e) => onChange(e.target.value)}
          onClick={handleClick}
          variant="outlined"
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    bgcolor: color,
                    border: "1px solid #ccc",
                    borderRadius: 0,
                  }}
                />
              </InputAdornment>
            ),
          }}
          sx={{ ...inputSx }}
        />

        <Popper open={open} anchorEl={anchorRef.current} placement="bottom-start" style={{ zIndex: 1300 }}>
          <Paper elevation={3} sx={{ p: 1, mt: 1 }}>
            <HexColorPicker color={color} onChange={handleColorChange} />
          </Paper>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
};

export default ColorPicker;
