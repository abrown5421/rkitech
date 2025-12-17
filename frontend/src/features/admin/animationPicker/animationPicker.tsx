import React from "react";
import { Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import type { EntranceAnimation, ExitAnimation } from "../../frontend/animation/animationTypes";

export interface AnimationPickerProps {
  entranceAnimation?: EntranceAnimation;
  exitAnimation?: ExitAnimation;
  onChange: (changes: { entranceAnimation?: EntranceAnimation; exitAnimation?: ExitAnimation }) => void;
}

const entranceAnimations: EntranceAnimation[] = [
  "animate__backInDown",
  "animate__backInLeft",
  "animate__backInRight",
  "animate__backInUp",
  "animate__bounceIn",
  "animate__bounceInDown",
  "animate__bounceInLeft",
  "animate__bounceInRight",
  "animate__bounceInUp",
  "animate__fadeIn",
  "animate__fadeInDown",
  "animate__fadeInDownBig",
  "animate__fadeInLeft",
  "animate__fadeInLeftBig",
  "animate__fadeInRight",
  "animate__fadeInRightBig",
  "animate__fadeInUp",
  "animate__fadeInUpBig",
  "animate__fadeInTopLeft",
  "animate__fadeInTopRight",
  "animate__fadeInBottomLeft",
  "animate__fadeInBottomRight",
  "animate__flipInX",
  "animate__flipInY",
  "animate__lightSpeedInRight",
  "animate__lightSpeedInLeft",
  "animate__rotateIn",
  "animate__rotateInDownLeft",
  "animate__rotateInDownRight",
  "animate__rotateInUpLeft",
  "animate__rotateInUpRight",
  "animate__jackInTheBox",
  "animate__rollIn",
  "animate__zoomIn",
  "animate__zoomInDown",
  "animate__zoomInLeft",
  "animate__zoomInRight",
  "animate__zoomInUp",
  "animate__slideInDown",
  "animate__slideInLeft",
  "animate__slideInRight",
  "animate__slideInUp",
];

const exitAnimations: ExitAnimation[] = [
  "animate__backOutDown",
  "animate__backOutLeft",
  "animate__backOutRight",
  "animate__backOutUp",
  "animate__bounceOut",
  "animate__bounceOutDown",
  "animate__bounceOutLeft",
  "animate__bounceOutRight",
  "animate__bounceOutUp",
  "animate__fadeOut",
  "animate__fadeOutDown",
  "animate__fadeOutDownBig",
  "animate__fadeOutLeft",
  "animate__fadeOutLeftBig",
  "animate__fadeOutRight",
  "animate__fadeOutRightBig",
  "animate__fadeOutUp",
  "animate__fadeOutUpBig",
  "animate__fadeOutTopLeft",
  "animate__fadeOutTopRight",
  "animate__fadeOutBottomRight",
  "animate__fadeOutBottomLeft",
  "animate__flipOutX",
  "animate__flipOutY",
  "animate__lightSpeedOutRight",
  "animate__lightSpeedOutLeft",
  "animate__rotateOut",
  "animate__rotateOutDownLeft",
  "animate__rotateOutDownRight",
  "animate__rotateOutUpLeft",
  "animate__rotateOutUpRight",
  "animate__rollOut",
  "animate__zoomOut",
  "animate__zoomOutDown",
  "animate__zoomOutLeft",
  "animate__zoomOutRight",
  "animate__zoomOutUp",
  "animate__slideOutDown",
  "animate__slideOutLeft",
  "animate__slideOutRight",
  "animate__slideOutUp",
];

export const AnimationPicker: React.FC<AnimationPickerProps> = ({
  entranceAnimation,
  exitAnimation,
  onChange,
}) => {
  return (
    <Box display="flex" flexDirection="row" gap={2}>
      <FormControl fullWidth size="small">
        <InputLabel>Entrance Animation</InputLabel>
        <Select
          value={entranceAnimation || ""}
          onChange={(e) => onChange({ entranceAnimation: e.target.value as EntranceAnimation })}
          label="Entrance Animation"
        >
          {entranceAnimations.map((anim) => (
            <MenuItem key={anim} value={anim}>
              {anim.replace("animate__", "")}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth size="small">
        <InputLabel>Exit Animation</InputLabel>
        <Select
          value={exitAnimation || ""}
          onChange={(e) => onChange({ exitAnimation: e.target.value as ExitAnimation })}
          label="Exit Animation"
        >
          {exitAnimations.map((anim) => (
            <MenuItem key={anim} value={anim}>
              {anim.replace("animate__", "")}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};
