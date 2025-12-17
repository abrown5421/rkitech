import { Box, Typography, Button } from "@mui/material";
import Animation from "../animation/Animation";

export const componentMap: Record<string, React.ElementType> = {
  box: Box,
  typography: Typography,
  button: Button,
  image: Box,
  animation: Animation,
};
