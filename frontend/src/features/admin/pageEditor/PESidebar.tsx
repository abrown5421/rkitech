import React from "react";
import { Box, Divider, Typography, useTheme } from "@mui/material";
import { useAppSelector } from "../../../store/hooks";
import BoxEditor from "../boxEditor/BoxEditor";
import TypographyEditor from "../typographyEditor/TypographyEditor";

const Sidebar: React.FC = () => {
  const theme = useTheme();
  const renderer = useAppSelector((state) => state.renderer)

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
            {renderer.hover && <Typography variant="caption" color="success">(Hover Mode)</Typography>}
          </Box>
          <Divider sx={{my: 2}} />
          {renderer.originalElement.component === 'box' && <BoxEditor />}
          {renderer.originalElement.component === 'typography' && <TypographyEditor />}
        </>
      ) : (
        <Typography>No Element</Typography>
      )}
    </Box>
  );
};

export default Sidebar;
