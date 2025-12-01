import React, { useState } from "react";
import { Box, TextField, Checkbox, FormControlLabel, Typography } from "@mui/material";
import type { SpacingPickerProps } from "./spacingPickerTypes";

const parse = (val: string) => {
  const parts = val.split(" ").map(p => parseInt(p.replace("px", ""), 10));
  return {
    top: parts[0] ?? 0,
    right: parts[1] ?? parts[0] ?? 0,
    bottom: parts[2] ?? parts[0] ?? 0,
    left: parts[3] ?? parts[1] ?? parts[0] ?? 0,
  };
};

const format = (obj: { top: number; right: number; bottom: number; left: number }) =>
  `${obj.top}px ${obj.right}px ${obj.bottom}px ${obj.left}px`;

const SpacingPicker: React.FC<SpacingPickerProps> = ({ margin, padding, onChange }) => {
  const marginObj = parse(margin);
  const paddingObj = parse(padding);

  const [lockMargin, setLockMargin] = useState(false);
  const [lockPadding, setLockPadding] = useState(false);

  const clampValue = (section: "margin" | "padding", num: number) => {
    if (isNaN(num)) num = 0;
    const min = section === "margin" ? -100 : 0;
    return Math.max(min, Math.min(100, num));
  };

  const handleChange = (
    section: "margin" | "padding",
    side: "top" | "right" | "bottom" | "left",
    val: string
  ) => {
    let num = clampValue(section, parseInt(val, 10));
    const obj = section === "margin" ? marginObj : paddingObj;
    const locked = section === "margin" ? lockMargin : lockPadding;

    let updated;

    if (locked) {
      updated = { top: num, right: num, bottom: num, left: num };
    } else {
      updated = { ...obj, [side]: num };
    }

    onChange({
      margin: section === "margin" ? format(updated) : margin,
      padding: section === "padding" ? format(updated) : padding,
    });
  };

  const toggleLock = (section: "margin" | "padding") => {
    const isMargin = section === "margin";
    const locked = isMargin ? lockMargin : lockPadding;
    const obj = isMargin ? marginObj : paddingObj;

    const newLocked = !locked;

    if (newLocked) {
      const synced = { top: obj.top, right: obj.top, bottom: obj.top, left: obj.top };
      onChange({
        margin: isMargin ? format(synced) : margin,
        padding: !isMargin ? format(synced) : padding,
      });
    } else {
      const reset = { top: obj.top, right: 0, bottom: 0, left: 0 };
      onChange({
        margin: isMargin ? format(reset) : margin,
        padding: !isMargin ? format(reset) : padding,
      });
    }

    if (isMargin) setLockMargin(newLocked);
    else setLockPadding(newLocked);
  };

  const renderInputs = (label: string, section: "margin" | "padding", obj: any, locked: boolean) => (
    <Box display="flex" flexDirection="column">
      <Box
        display="grid"
        gridTemplateColumns="repeat(4, 1fr)"
        gap={1}
        width="100%"
      >
        {(["top", "right", "bottom", "left"] as const).map((side) => (
          <TextField
            key={side}
            label={`${label} ${side}`}
            type="number"
            size="small"
            value={obj[side]}
            onChange={(e) => handleChange(section, side, e.target.value)}
            inputProps={{
              min: section === "margin" ? -100 : 0,
              max: 100
            }}
            fullWidth
            disabled={locked && side !== "top"}
          />
        ))}
      </Box>
      <FormControlLabel
        control={
          <Checkbox
            checked={locked}
            onChange={() => toggleLock(section)}
            size="small"
            sx={{padding: '2px 5px 2px 10px'}}
          />
        }
        label={<Typography pt="2px" variant="caption">Lock {label}</Typography>}
      />
    </Box>
  );

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      {renderInputs("Margin", "margin", marginObj, lockMargin)}
      {renderInputs("Padding", "padding", paddingObj, lockPadding)}
    </Box>
  );
};

export default SpacingPicker;
