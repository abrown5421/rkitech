import React, { useState, useRef, useEffect } from "react";
import { Box, TextField, InputAdornment, Popper, Paper, Typography } from "@mui/material";
import { HexColorPicker } from "react-colorful";
import type { ColorPickerProps } from "./colorPickerTypes";
import { useGetActiveThemeQuery } from "../../features/theme/themeApi";
import type { ColorObject } from "../../features/theme/themeTypes";
import { resolveThemeValue } from "../../hooks/useThemeValue";

const ColorPicker: React.FC<ColorPickerProps> = ({ label, color, onChange, inputProps, containerSx }) => {
  const { data: theme } = useGetActiveThemeQuery();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLInputElement | null>(null);
  const popperRef = useRef<HTMLDivElement | null>(null);
  
  const resolvedColor = resolveThemeValue(color, theme);

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

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen((prev) => !prev);
  };
  
  const handleColorChange = (newColor: string) => {
    onChange(newColor);
  };
  
  return (
    <Box sx={{ ...containerSx }} onClick={(e) => e.stopPropagation()}>
      <TextField
        fullWidth
        label={label}
        {...inputProps}
        inputRef={anchorRef}
        value={resolvedColor}
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
                  bgcolor: resolvedColor,
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
        style={{ zIndex: 1300 }}
      >
        <Paper ref={popperRef} elevation={3} sx={{ p: 1, mt: 1 }}>
          {theme && (
            <Box>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                Theme Colors:
              </Typography>

              <Box
                sx={{
                  mt: 1,
                  display: "flex",
                  flexDirection: "row",
                  gap: 1,
                }}
              >
                {[
                  "primary",
                  "secondary",
                  "accent",
                  "success",
                  "warning",
                  "error",
                  "neutral",
                  "neutral2",
                  "neutral3",
                ].map((key) => {
                  const colorGroup = (theme as any)[key] as ColorObject;
                  if (!colorGroup) return null;

                  return (
                    <Box key={key} sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                      <Box
                        onClick={() => handleColorChange(colorGroup.main)}
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: colorGroup.main,
                          borderRadius: "4px",
                          border: "1px solid rgba(0,0,0,0.2)",
                          cursor: "pointer",
                          "&:hover": { outline: "2px solid #999" },
                        }}
                        title={`${key}.main`}
                      />

                      <Box
                        onClick={() => handleColorChange(colorGroup.content)}
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: colorGroup.content,
                          borderRadius: "4px",
                          border: "1px solid rgba(0,0,0,0.2)",
                          cursor: "pointer",
                          "&:hover": { outline: "2px solid #999" },
                        }}
                        title={`${key}.content`}
                      />
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}
          <Typography variant="caption" sx={{ opacity: 0.7, mt: 1, display: 'block' }}>
            Custom Color:
          </Typography>
          <HexColorPicker color={color} onChange={handleColorChange} style={{width: '100%', marginTop: '0.5rem'}}/>
        </Paper>
      </Popper>
    </Box>
  );
};

export default ColorPicker;