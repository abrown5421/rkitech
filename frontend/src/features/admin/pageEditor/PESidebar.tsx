import React, { useEffect } from "react";
import { Box, Divider, Typography, useTheme } from "@mui/material";
import { useAppSelector } from "../../../store/hooks";
import BoxEditor from "../boxEditor/BoxEditor";
import TypographyEditor from "../typographyEditor/TypographyEditor";
import ButtonEditor from "../buttonEditor/ButtonEditor";
import ImageEditor from "../imageEditor/ImageEditor";
import ElementBank from "../elementBank/ElementBank";

const Sidebar: React.FC = () => {
  const theme = useTheme();
  const renderer = useAppSelector((state) => state.renderer)

  useEffect(()=>{console.log(renderer)}, [renderer])
  
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
        <>
          <Box display='flex'  flexDirection='row' justifyContent='space-between'>
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
        </>
      ) : (
        <ElementBank />
      )}
    </Box>
  );
};

export default Sidebar;
