import React, { useState, useRef } from "react";
import {
  Box,
  TextField,
  Popper,
  Paper,
  ClickAwayListener,
  List,
  ListItemButton,
  ListItemText,
  InputAdornment,
} from "@mui/material";
import type { FontType, FontPickerProps } from "./fontPickerTypes";

const FONT_OPTIONS: FontType[] = [
  "PrimaryFont",
  "SecondaryFont",
  "Arial",
  "Verdana",
  "Tahoma",
  "Trebuchet MS",
  "Times New Roman",
  "Georgia",
  "Garamond",
  "Courier New",
  "Brush Script MT",
];

const FontPicker: React.FC<FontPickerProps> = ({ font, onChange, label, sx, inputSx }) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => setOpen((prev) => !prev);
  const handleClickAway = () => setOpen(false);

  const handleFontSelect = (newFont: FontType) => {
    onChange(newFont);
    setOpen(false);
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ ...sx }}>
        <TextField
          fullWidth
          label={label}
          inputRef={anchorRef}
          value={font}
          onClick={handleClick}
          onChange={(e) => onChange(e.target.value as FontType)}
          variant="outlined"
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Box
                  sx={{
                    px: 1,
                    py: 0.5,
                    fontFamily: font,
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                  }}
                >
                  Aa
                </Box>
              </InputAdornment>
            ),
          }}
          sx={{ ...inputSx }}
        />

        <Popper
          open={open}
          anchorEl={anchorRef.current}
          placement="bottom-start"
          style={{ zIndex: 1300 }}
        >
          <Paper elevation={3} sx={{ mt: 1, maxHeight: 250, overflowY: "auto", width: 260 }}>
            <List dense>
              {FONT_OPTIONS.map((f) => (
                <ListItemButton key={f} onClick={() => handleFontSelect(f)}>
                  <ListItemText
                    primary={f}
                    primaryTypographyProps={{ fontFamily: f }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Paper>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
};

export default FontPicker;
