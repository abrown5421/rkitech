import React, { useState, useRef, useEffect } from "react";
import { Box, TextField, InputAdornment, Popper, Paper, Typography, IconButton, Tooltip } from "@mui/material";
import { HexColorPicker } from "react-colorful";
import { useTheme } from "@mui/material/styles";
import type { ColorPickerProps } from "./colorPickerTypes";

const ColorPicker: React.FC<ColorPickerProps> = ({ label, value, onChange, containerSx, inputProps, themeOnly = false }) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLInputElement | null>(null);
  const popperRef = useRef<HTMLDivElement | null>(null);

  const themeColors = Object.entries(theme.palette)
    .filter(([_, val]) => typeof val === "object" && "main" in val)
    .flatMap(([name, val]: [string, any]) => {
      const colors = [{ name: `${name} (main)`, color: val.main }];
      if (!themeOnly && val.content) {
        colors.push({ name: `${name} (content)`, color: val.content });
      }
      return colors;
    });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        anchorRef.current &&
        !anchorRef.current.contains(event.target as Node) &&
        popperRef.current &&
        !popperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen((prev) => !prev);
  };

  const handleSwatchClick = (color: string) => {
    onChange(color);
    setOpen(false);
  };

  const handleHexChange = (color: string) => {
    onChange(color.startsWith("#") ? color : `#${color}`);
  };

  return (
    <Box sx={{ ...containerSx }} onClick={(e) => e.stopPropagation()}>
      <TextField
        fullWidth
        size="small"
        label={label}
        {...inputProps}
        inputRef={anchorRef}
        value={value.replace(/^#/, '')}
        onClick={handleInputClick}
        onChange={(e) => onChange(e.target.value.replace(/^#/, ""))}
        InputProps={{
          startAdornment: <InputAdornment position="start">#</InputAdornment>,
          endAdornment: (
            <InputAdornment position="end">
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  bgcolor: value,
                  border: "1px solid #ccc",
                  borderRadius: 0,
                }}
              />
            </InputAdornment>
          ),
        }}
      />

      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement="bottom-start"
        style={{ zIndex: 1300, width: '400px' }}
      >
        <Paper ref={popperRef} elevation={3} sx={{ p: 2, mt: 1 }}>
          <Typography variant="caption" sx={{ opacity: 0.7 }}>
            Theme Colors:
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
            {themeColors.map(({ name, color }, idx) => (
                <Tooltip key={idx} title={name} placement="bottom">
                    <IconButton
                        onClick={() => handleSwatchClick(themeOnly ? name.replace(" (main)", "") : color)}
                        sx={{
                            width: 32,
                            height: 32,
                            bgcolor: color,
                            border: "1px solid rgba(0,0,0,0.2)",
                            "&:hover": {
                            bgcolor: color, 
                            },
                        }}
                    />
                </Tooltip>
            ))}
          </Box>
          
          {!themeOnly && (
            <>
              <Typography variant="caption" sx={{ opacity: 0.7, mt: 2, display: "block" }}>
                Custom Color:
              </Typography>
              <HexColorPicker
                color={value || '#ffffff'}
                onChange={handleHexChange}
                style={{ width: "100%", marginTop: "0.5rem" }}
              />
            </>
          )}
        </Paper>
      </Popper>
    </Box>
  );
};

export default ColorPicker;
