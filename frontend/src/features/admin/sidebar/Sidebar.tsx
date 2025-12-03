import React from "react";
import { useNavigation } from "../../../hooks/useNavigate";
import { Box, Button, Stack, useTheme } from "@mui/material";
import SpeedIcon from "@mui/icons-material/Speed";
import { AutoStories } from "@mui/icons-material";
import { useGetPagesQuery } from "../../frontend/page/pageApi";
import { useAppSelector } from "../../../store/hooks";

const Sidebar: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigation();
  const { data: pages } = useGetPagesQuery();
  const activePage = useAppSelector((state) => state.activePage);

  const goToPage = (pageUid: string) => {
    if (!pages) return;
    const page = pages.find((p: any) => p.pageUniqueId === pageUid);
    if (page) {
      navigate(page, true);
    }
  };

  const buttonStyles = (pName: string) => {
    const styleObj = {
      justifyContent: 'flex-start',
      textTransform: 'none',
      fontWeight: 500,
      color: (pName === activePage.activePageUid ? theme.palette.primary.main : theme.palette.neutral.content) || '#fff', 
      backgroundColor: 'transparent',
      transition: "all 0.3s ease",
      '&:hover': {
        backgroundColor: theme.palette.neutral.main || '#fff',
        color: (pName === activePage.activePageUid ? theme.palette.accent.main : theme.palette.primary.main) || '#FE9A00',   
      },
      borderRadius: 2,
    }
    return (styleObj)
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      bgcolor={theme.palette.neutral3.main}
      color={theme.palette.neutral3.content}
      boxShadow="0 5px 10px rgba(0,0,0,0.15)"
      zIndex={3}
      flex={2}
      p={4}
    >
      <Stack spacing={2}>
        <Button
          startIcon={<SpeedIcon />}
          onClick={() => goToPage("page_id_admin_dash")}
          sx={buttonStyles('page_id_admin_dash')}
        >
          Dashboard
        </Button>
        <Button
          startIcon={<AutoStories />}
          onClick={() => goToPage("page_id_admin_pages")}
          sx={buttonStyles('page_id_admin_pages')}
        >
          Pages
        </Button>
      </Stack>
    </Box>
  );
};

export default Sidebar;
