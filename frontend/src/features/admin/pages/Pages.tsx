import React from 'react';
import { Box, Typography, Stack, useTheme, IconButton, Tooltip } from '@mui/material';
import HandymanIcon from '@mui/icons-material/Handyman';
import { useGetNonAdminPagesQuery, useGetPagesQuery } from '../../frontend/page/pageApi';
import { useNavigation } from '../../../hooks/useNavigate';

const Pages: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigation();
  const { data: editablePages } = useGetNonAdminPagesQuery();
  const { data: allPages } = useGetPagesQuery();
  
  if (!editablePages) return null;

  const handleHandymanClick = (pageId: string) => {
    const path = `/admin/page-editor?id=${pageId}`;
    
    let pageEditor = allPages?.find(
      (p) => p.pageUniqueId === 'page_id_admin_page_editor'
    );

    if (!pageEditor) {
      console.warn("No page found with page_id_admin_page_editor");
      return;
    }
    
    pageEditor = {
      ...pageEditor,
      pagePath: path,
    };

    navigate(pageEditor);
  };

  return (
    <Box
      className="app-page"
      display="flex"
      flexDirection="row"
      width="100%"
      p={4}
    >
      <Stack spacing={2} width="100%">
        {editablePages.map((page) => (
          <Box
            key={page.pageName}
            display="flex"
            flexDirection="row"
            width="100%"
            height={80}
            borderRadius={2}
            overflow="hidden"
            boxShadow={1}
            position="relative"
            boxSizing="border-box"
            p={2}
          >
            <Box position="absolute" top={4} right={4} zIndex={2} color={theme.palette.success.main}>
              <Tooltip title="Edit Page">
                <IconButton
                  size="small"
                  color='secondary'
                  onClick={() => handleHandymanClick(page._id)}
                >
                  <HandymanIcon />
                </IconButton>
              </Tooltip>
            </Box>

            <Box display="flex" flexDirection="column">
              <Typography
                variant="subtitle1"
                color={theme.palette.neutral.content}
                textTransform="capitalize"
                fontFamily="Secondary"
                display="flex"
                alignItems="center"
              >
                {page.pageName}

                <Typography
                  variant="caption"
                  color={
                    page.pageActive
                      ? theme.palette.success.main
                      : theme.palette.error.main
                  }
                  textTransform="capitalize"
                  fontFamily="Secondary"
                  display="flex"
                  ml={1}
                >
                  {page.pageActive ? '(Active)' : '(Inactive)'}
                </Typography>
              </Typography>

              <Typography
                variant="caption"
                color={theme.palette.neutral.content}
                textTransform="lowercase"
                fontFamily="Secondary"
              >
                {page.pagePath}
              </Typography>
            </Box>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default Pages;
