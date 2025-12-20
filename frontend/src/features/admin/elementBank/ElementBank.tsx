import React from "react";
import { Box, useTheme, Typography } from "@mui/material";
import { componentMap } from "../../frontend/renderer/componentMap";
import DraggableElement from "./DraggableElement";
import {
  CropSquare,
  TextFields,
  SmartButton,
  Image,
  Movie,
} from "@mui/icons-material";
import { useViewport } from "../../frontend/viewportProvider/ViewportProvider";

const ElementBank: React.FC = () => {
  const theme = useTheme();
  const { isMobile, isTablet } = useViewport();

  const iconMap: Record<string, React.ElementType> = {
    box: CropSquare,
    typography: TextFields,
    button: SmartButton,
    image: Image,
    animation: Movie,
  };

  const itemFlexBasis = isMobile || isTablet ? "100%" : "calc(50% - 8px)";

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
          <DraggableElement
            key={key}
            id={key}
            sx={{
              flex: `0 0 ${itemFlexBasis}`,
            }}
          >
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              borderRadius="10px"
              border={`1px solid ${theme.palette.neutral.content}`}
              py={4}
              px={2}
              gap={1}
            >
              {Icon && (
                <Icon
                  fontSize="large"
                  sx={{ color: theme.palette.neutral.content }}
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