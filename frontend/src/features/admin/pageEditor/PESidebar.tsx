import React from "react";
import { Box, Divider, IconButton, Tooltip, Typography, useTheme } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import BoxEditor from "../boxEditor/BoxEditor";
import TypographyEditor from "../typographyEditor/TypographyEditor";
import ButtonEditor from "../buttonEditor/ButtonEditor";
import ImageEditor from "../imageEditor/ImageEditor";
import ElementBank from "../elementBank/ElementBank";
import { Deselect } from "@mui/icons-material";
import { deselectElement } from "../../frontend/renderer/rendererSlice";

const Sidebar: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const renderer = useAppSelector((state) => state.renderer)
  
  const handleDeselect = () => {
    dispatch(deselectElement())
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      bgcolor={theme.palette.neutral3.main}
      color={theme.palette.neutral3.content}
      boxShadow="0 5px 10px rgba(0,0,0,0.15)"
      zIndex={3}
      flex={3}
      p={2}
    >
      {renderer.originalElement ? (
        <Box display='flex' flexDirection='column' overflow='auto'>
          <Box display='flex' flexDirection='row' alignItems='center' justifyContent='space-between'>
            <Tooltip title="Deselect Element">
              <IconButton
                onClick={handleDeselect}
                sx={{
                  p: 0,
                  m: 0,
                  color: 'inherit', 
                  '&:hover': {
                    color: theme.palette.primary.main,
                    backgroundColor: theme.palette.action.hover, 
                  },
                }}
              >
                <Deselect />
              </IconButton>
            </Tooltip>
            <Typography variant="caption">Element #{renderer.originalElement._id}</Typography>    
            <Box display="flex" gap={1}>
              {renderer.hover && <Typography variant="caption" color="success">(Hover)</Typography>}
              {renderer.mobile && <Typography variant="caption" color="info">(Mobile)</Typography>}
              {renderer.tablet && <Typography variant="caption" color="info">(Tablet)</Typography>}
              {renderer.desktop && <Typography variant="caption" color="info">(Desktop)</Typography>}
            </Box>
          </Box>
          <Divider sx={{my: 2}} />
          {renderer.originalElement.component === 'box' && <BoxEditor />}
          {renderer.originalElement.component === 'animation' && <BoxEditor animation={true} />}
          {renderer.originalElement.component === 'typography' && <TypographyEditor />}
          {renderer.originalElement.component === 'button' && <ButtonEditor />}
          {renderer.originalElement.component === 'image' && <ImageEditor />}
        </Box>
      ) : (
        <ElementBank />
      )}
    </Box>
  );
};

export default Sidebar;
