import React from 'react';
import { Box, Button, Stack } from '@mui/material';
import SpeedIcon from '@mui/icons-material/Speed';
import ExploreIcon from '@mui/icons-material/Explore';
import { AutoStories, CallToAction, ColorLens } from '@mui/icons-material';
import { useGetPagesQuery } from '../../../page/pageApi';
import { useGetActiveThemeQuery } from '../../../theme/themeApi';
import { useNavigation } from '../../../../hooks/useNavigate';
import { useAppSelector } from '../../../../store/hooks';

const AdminSidebar: React.FC = () => {
  const { data: pages } = useGetPagesQuery();
  const { data: theme } = useGetActiveThemeQuery();
  const navigate = useNavigation();
  const activePage = useAppSelector((state) => state.activePage);

  const buttonStyles = (pName: string) => {
    const styleObj = {
      justifyContent: 'flex-start',
      textTransform: 'none',
      fontWeight: 500,
      color: (pName === activePage.activePageName ? theme?.primary.main : theme?.neutral.content) || '#fff', 
      backgroundColor: 'transparent',
      transition: "all 0.3s ease",
      '&:hover': {
        backgroundColor: theme?.neutral?.main || '#fff',
        color: (pName === activePage.activePageName ? theme?.accent.main : theme?.primary?.main) || '#FE9A00',   
      },
      borderRadius: 2,
    }
    return (styleObj)
  };

  const goToPage = (pageName: string) => {
    if (!pages) return;
    const page = pages.find((p: any) => p.pageName === pageName);
    if (page) {
      navigate(page); 
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme?.neutral3.main || '#333', 
        color: theme?.neutral3.content,
        boxShadow: '0 5px 10px rgba(0,0,0,0.15)',
        zIndex: 3,
        flex: 2,
        p: 4,
      }}
    >
      <Stack spacing={2}>
        <Button startIcon={<SpeedIcon />} sx={buttonStyles('AdminDashPage')} onClick={() => goToPage('AdminDashPage')}>
          Dashboard
        </Button>
        <Button startIcon={<ExploreIcon />} sx={buttonStyles('AdminNavPage')} onClick={() => goToPage('AdminNavPage')}>
          Navbar
        </Button>
        <Button startIcon={<CallToAction />} sx={buttonStyles('AdminFooterPage')} onClick={() => goToPage('AdminFooterPage')}>
          Footer
        </Button>
        <Button startIcon={<AutoStories />} sx={buttonStyles('AdminPagesPage')} onClick={() => goToPage('AdminPagesPage')}>
          Pages
        </Button>
        <Button startIcon={<ColorLens />} sx={buttonStyles('AdminThemePage')} onClick={() => goToPage('AdminThemePage')}>
          Themes
        </Button>
      </Stack>
    </Box>
  );
};

export default AdminSidebar;
