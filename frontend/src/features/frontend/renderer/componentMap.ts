import { Box, Typography, Button, List, ListItem } from "@mui/material";
import Animation from "../animation/Animation";

export const componentMap: Record<string, React.ElementType> = {
  box: Box,
  typography: Typography,
  button: Button,
  list: List,
  listItem: ListItem,
  animation: Animation,
};
