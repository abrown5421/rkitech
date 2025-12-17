import React from "react";
import { Box, useTheme, Typography } from "@mui/material";
import { componentMap } from "../../frontend/renderer/componentMap";
import DraggableElement from "./DraggableElement";
import {
  CropSquare,
  TextFields,
  SmartButton,
  Movie,
} from "@mui/icons-material";

const ElementBank: React.FC = () => {
  const theme = useTheme();

  const iconMap: Record<string, React.ElementType> = {
    box: CropSquare,
    typography: TextFields,
    button: SmartButton,
    animation: Movie,
  };

  return (
      <Box
        display="flex"
        flexDirection="row"
        flexWrap="wrap"
        gap={2}
        position="relative"
      >
        {Object.entries(componentMap).map(([key]) => {
          const Icon = iconMap[key];

          return (
            <DraggableElement key={key} id={key}>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                flex={1}
                borderRadius="10px"
                border={`1px solid ${theme.palette.neutral.content}`}
                py={4}
                px={2}
                minWidth={200}
                gap={1}
                color={theme.palette.neutral.content}
                sx={{
                  boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    color: theme.palette.primary.main,
                    border: `1px solid ${theme.palette.primary.main}`,
                  },
                }}
              >
                {Icon && (
                  <Icon
                    fontSize="large"
                    sx={{ color: "currentColor" }}
                  />
                )}

                <Typography variant="caption">
                  {key.toUpperCase()}
                </Typography>
              </Box>
            </DraggableElement>
          );
        })}
      </Box>
    
  );
};

export default ElementBank;
