import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, IconButton, Select, TextField, Tooltip, Typography, MenuItem, InputLabel, FormControl, FormHelperText } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import TrashIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import { Add } from "@mui/icons-material";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useDeletePageMutation, useGetPagesQuery, useCreatePageMutation, useUpdatePageMutation } from '../../../page/pageApi';
import { useNavigation } from "../../../../hooks/useNavigate";
import { openAlert } from '../../../alert/alertSlice';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { useGetActiveThemeQuery } from '../../../theme/themeApi';
import type { IPage } from '../../../page/pageTypes';
import { useLocation } from 'react-router-dom';
import { DEFAULT_PAGE } from './adminPagesPageTypes';
import FontPicker from '../../../../components/fontPicker/FontPicker';
import ColorPicker from '../../../../components/colorPicker/ColorPicker';
import { AnimationPicker } from '../../../../components/animationPicker/AnimationPicker';
import type { FontType } from '../../../../components/fontPicker/fontPickerTypes';
import type { EntranceAnimation, ExitAnimation } from '../../../../components/animBox/animBoxTypes';
import { elementsApi, useCreateElementsMutation, useDeleteElementsMutation } from '../../../elements/elementsApi';

const AdminPagesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigation();
  const location = useLocation();
  const { data: pages, isLoading, isError } = useGetPagesQuery();
  const { data: theme } = useGetActiveThemeQuery();
  const [deletePage, { isLoading: isDeleting }] = useDeletePageMutation();
  const [createPage] = useCreatePageMutation();
  const [updatePage, { isLoading: isUpdating }] = useUpdatePageMutation();
  const [createElements] = useCreateElementsMutation();
  const [deleteElement] = useDeleteElementsMutation();

  const activePage = useAppSelector((state) => state.activePage);

  const searchParams = new URLSearchParams(location.search);
  const pageId = searchParams.get("id");
  const action = searchParams.get("action");
  
  const thisPage = pages?.find((p) => p._id === pageId);
  const [editablePage, setEditablePage] = useState<IPage | undefined>(thisPage);
  const [newPage, setNewPage] = useState<Partial<IPage>>(DEFAULT_PAGE);
  
  useEffect(() => {
    setEditablePage(thisPage);
  }, [thisPage]);

  if (isLoading) return <Typography sx={{ p: 4 }}>Loading pages...</Typography>;
  if (isError || !pages) return <Typography sx={{ p: 4 }}>Failed to load pages.</Typography>;

  const filteredPages = pages.filter(
    (page) => !page.pagePath?.toLowerCase().startsWith('/admin')
  );

  const navigateToPath = (path: string) => {
    if (!activePage.activePageObj) return;
    navigate({
      ...activePage.activePageObj,
      pagePath: path,
    } as IPage, true);
  };
  
  const showAlert = (body: string, severity: 'success' | 'error') => {
    dispatch(openAlert({
      body,
      closeable: true,
      severity,
      orientation: "bottom-right",
    }));
  };
  
  const deleteElementRecursively = async (elementId: string): Promise<void> => {
    try {
      const subscription = dispatch(
        elementsApi.endpoints.getElementsById.initiate(elementId)
      );

      const { data } = await subscription;

      const element = Array.isArray(data) ? data[0] : data;

      if (!element) {
        console.warn(`Skipping deletion of element ${elementId} - not found`);
        subscription.unsubscribe();
        return;
      }

      if (Array.isArray(element.children) && element.children.length > 0) {
        for (const childId of element.children) {
          await deleteElementRecursively(childId);
        }
      }

      await deleteElement(elementId).unwrap();

      subscription.unsubscribe();

    } catch (error) {
      console.error(`Failed to delete element ${elementId}:`, error);
    }
  };


  const handlePageDelete = async (id?: string) => {
    if (!id || !window.confirm("Are you sure you want to delete this page?")) return;

    try {
      const pageToDelete = pages?.find((p) => p._id === id);
      
      if (pageToDelete?.pageContent && Array.isArray(pageToDelete.pageContent)) {
        for (const rootElementId of pageToDelete.pageContent) {
          await deleteElementRecursively(rootElementId);
        }
      }
      
      await deletePage(id).unwrap();
      showAlert("Page and associated elements deleted successfully", 'success');
    } catch (error) {
      showAlert(`Failed to delete page: ${error}`, 'error');
    }
  };

  const handlePageSave = async (type: 'new' | 'existing') => {
    if (type === 'existing' && (!editablePage || !pageId)) return;

    try {
      if (type === 'new') {
        const pageData = { ...newPage }; 
        if (pageData.pageRenderMethod === 'dynamic') {
          const pageNameElement = {
            type: "typography",
            data: {
              variant: "body1",
              text: `${pageData.pageName || 'Page'}`
            },
            name: `${pageData.pageName || 'Page'} body text`
          };
          
          const createdPageNameElement = await createElements(pageNameElement).unwrap();

          const rootElement = {
            type: "box",
            sx: {
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "row",
              minHeight: "calc(100vh - 50px)",
              backgroundColor: "$theme.neutral.main",
              m: 3
            },
            children: [`${createdPageNameElement.data._id}`],
            order: 0,
            name: `${pageData.pageName || 'Page'} root`
          };
          
          const createdElement = await createElements(rootElement).unwrap();
          
          pageData.pageContent = [`${createdElement.data._id}`];

        }
        
        await createPage(pageData).unwrap();
        showAlert('Page created successfully', 'success');
        navigateToPath('/admin/pages');
      } else {
        await updatePage({ id: pageId!, data: editablePage! }).unwrap();
        showAlert('Page updated successfully', 'success');
      }
    } catch (error) {
      showAlert(`Failed to save page: ${error}`, 'error');
    }
  };

  if (action === "new" || (pageId && editablePage)) {
    const isNew = action === "new";
    const page = isNew ? newPage : editablePage!;
    const isChanged = JSON.stringify(page) !== JSON.stringify(isNew ? DEFAULT_PAGE : thisPage);
    
    const handleChange = (updates: Partial<IPage>) => {
      if (isNew) {
        setNewPage({ ...newPage, ...updates });
      } else {
        setEditablePage({ ...editablePage!, ...updates });
      }
    };

    const handleRevert = () => {
      if (!isNew) {
        setEditablePage(thisPage);
      }
    };
    
    return (
      <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)', overflow: 'scroll' }}>
        <Box sx={{ display: 'flex', flexDirection: "row", justifyContent: "space-between", mb:2 }}>
          <Typography variant="h6" sx={{ fontFamily: 'PrimaryFont' }}>
            {isNew ? 'New Page Editor' : `Editing ${page.pageName} Page`}
          </Typography>
          <Button
            startIcon={<EditIcon />}
            onClick={() => navigateToPath(`${activePage.activePageObj?.pagePath}?action=new`)}
            sx={{
              backgroundColor: theme?.primary.main,
              color: theme?.primary.content,
              border: '1px solid transparent',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: theme?.neutral.main,
                color: theme?.primary.main,
                borderColor: theme?.primary.main,
              },
            }}
          >
            Edit Page
          </Button>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, mb: 3 }}>
          <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth
              disabled={page.pagePath === '/'}
              size='small'
              label="Page Path"
              value={page.pagePath || ''}
              onChange={(e) => handleChange({ pagePath: e.target.value })}
              helperText={page.pagePath === '/' ? "The root route cannot be modified. Something has to appear at '/'" : "The URL the page should be present at"}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <FormControl fullWidth >
              <InputLabel>Render Method</InputLabel>
              <Select
                size='small'
                value={page.pageRenderMethod || 'static'}
                label="Render Method"
                onChange={(e) => handleChange({ pageRenderMethod: e.target.value as 'static' | 'dynamic' })}
                
              >
                <MenuItem value="static">Static</MenuItem>
                <MenuItem value="dynamic">Dynamic</MenuItem>
              </Select>
              <FormHelperText>Static pages are fixed, dynamic can be edited</FormHelperText>
            </FormControl>
          </Box>
          <Box sx={{ flex: 1 }}>
            <FormControl fullWidth >
              <InputLabel>Page Status</InputLabel>
              <Select
                size='small'
                value={page.pageActive ? 'true' : 'false'}
                label="Page Status"
                onChange={(e) => handleChange({ pageActive: e.target.value === 'true' })}
              >
                <MenuItem value="true">Active</MenuItem>
                <MenuItem value="false">Inactive</MenuItem>
              </Select>
              <FormHelperText>Hide pages without deleting them</FormHelperText>
            </FormControl>
          </Box>
          <Box sx={{ flex: 1 }}>
            <ColorPicker
              inputProps={{
                label: "Page Color",
                sx: { width: '100%' },
                helperText: "The background color of the page"
              }}
              color={page.pageColor || ''}
              onChange={(color) => handleChange({ pageColor: color })}
            />
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, mb: 3 }}>
          
          <Box sx={{ flex: 1 }}>
            <FontPicker
              inputProps={{
                label: "Page Font",
                sx: { width: '100%' },
                helperText: "The font family used by all text on the page"
              }}
              font={page.pageFontFamily as FontType || 'PrimaryFont'}
              onChange={(font) => handleChange({ pageFontFamily: font })}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <ColorPicker
              inputProps={{
                label: "Font Color",
                sx: { width: '100%' },
                helperText: "The font color of the page"
              }}
              color={page.pageFontColor || ''}
              onChange={(color) => handleChange({ pageFontColor: color })}
            />
          </Box>
          <AnimationPicker
            entrance={page.pageEntranceAnimation as EntranceAnimation || ''}
            exit={page.pageExitAnimation as ExitAnimation || ''}
            onEntChange={(entrance) => handleChange({ pageEntranceAnimation: entrance })}
            onExtChange={(exit) => handleChange({ pageExitAnimation: exit })}
          />
        </Box>

        

        <Box sx={{ display: 'flex', justifyContent: 'end', mt: 'auto' }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
            {!isNew && (
              <Button
                onClick={handleRevert}
                disabled={!isChanged}
                sx={{
                  backgroundColor: isChanged ? theme?.secondary.main : '#ccc',
                  color: isChanged ? theme?.secondary.content : '#fff',
                  border: '1px solid transparent',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: theme?.neutral.main,
                    color: theme?.secondary.main,
                    borderColor: theme?.secondary.main,
                  },
                }}
              >
                Revert Changes
              </Button>
            )}
            
            <Button
              disabled={((!isNew && !isChanged) || isUpdating)}
              onClick={() => handlePageSave(isNew ? 'new' : 'existing')}
              sx={{
                backgroundColor: (isNew || isChanged) ? theme?.primary.main : '#ccc',
                color: (isNew || isChanged) ? theme?.primary.content : '#fff',
                border: '1px solid transparent',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: theme?.neutral.main,
                  color: theme?.primary.main,
                  borderColor: theme?.primary.main,
                },
              }}
            >
              {isUpdating ? <CircularProgress size={20} /> : 'Save Page'}
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 64px)',
        overflow: 'scroll',
        width: '100%',
        boxSizing: 'border-box',
        p: 4,
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: "row", justifyContent: "space-between", mb:2 }}>
        <Typography variant="h6" sx={{ fontFamily: 'PrimaryFont' }}>
          Page Manager
        </Typography>
        <Button
          startIcon={<Add />}
          onClick={() => navigateToPath(`${activePage.activePageObj?.pagePath}?action=new`)}
          sx={{
            backgroundColor: theme?.primary.main,
            color: theme?.primary.content,
            border: '1px solid transparent',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: theme?.neutral.main,
              color: theme?.primary.main,
              borderColor: theme?.primary.main,
            },
          }}
        >
          Add New Page
        </Button>
      </Box>
      <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
      {filteredPages.map((page) => (
        <Box
          key={page._id}
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: 'center',
            borderRadius: 2,
            p: 2,
            overflow: "hidden",
            boxShadow: 1,
            position: "relative",
            border: "1px solid rgba(0,0,0,0.1)",
          }}
        >          
          <Box sx={{display: "flex", flexDirection: "column"}}>
            <Typography variant="h6" sx={{ fontFamily: 'SecondaryFont', color: theme?.neutral.content }}>
              {page.pageName}
            </Typography>
            <Typography variant="subtitle1" sx={{color: theme?.neutral.content}}>
              {page.pagePath}
            </Typography>
            <Typography variant="caption" sx={page.pageActive ? ({color: theme?.success.main}) : ({color: theme?.error.main})}>
              {page.pageActive ? "Active" : "Inactive"}
            </Typography>
          </Box>
          <Box sx={{display: 'flex', flexDirection: 'row'}}>
            {page.pageRenderMethod === 'dynamic' && (
              <Tooltip title="Edit">
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  sx={{
                    color: theme?.primary.main,
                    border: "1px solid transparent",
                    "&:hover": { borderColor: theme?.primary.main },
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
            )}

            <Tooltip title="Settings">
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  navigateToPath(`${activePage.activePageObj?.pagePath}?id=${page._id}`)
                }}
                sx={{
                  color: theme?.secondary.main,
                  border: "1px solid transparent",
                  "&:hover": { borderColor: theme?.secondary.main },
                }}
              >
                <SettingsIcon />
              </IconButton>
            </Tooltip>

            {page.pagePath !== '/' && page.pagePath !== '/page-not-found' && (
              <Tooltip title="Delete">
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePageDelete(page._id);
                  }}
                  sx={{
                    color: theme?.error.main,
                    border: "1px solid transparent",
                    "&:hover": { borderColor: theme?.error.main },
                  }}
                >
                  {isDeleting ? (
                    <CircularProgress sx={{ color: theme?.error.main }} size={16} />
                  ) : (
                    <TrashIcon />
                  )}
                </IconButton>
              </Tooltip>
            )}

            <Tooltip title="View">
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(page);
                }}
                sx={{
                  color: theme?.success.main,
                  border: "1px solid transparent",
                  "&:hover": { borderColor: theme?.success.main },
                }}
              >
                <RemoveRedEyeIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      ))}
      </Box>
    </Box>
  );
};

export default AdminPagesPage;