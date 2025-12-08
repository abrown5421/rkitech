import { Box, Typography, Tooltip, Button, Paper, Card } from "@mui/material";
import Animation from "../animation/Animation";

export const componentMap: Record<string, React.ElementType> = {
  box: Box,
  typography: Typography,
  tooltip: Tooltip,
  button: Button,
  paper: Paper,
  card: Card,
  animation: Animation,
};
