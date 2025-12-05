import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetPageByIdQuery } from '../../frontend/page/pageApi';
import Renderer from '../../frontend/renderer/Renderer';
import { Alert, Box, Button, useTheme } from '@mui/material';
import { useGetElementsByIdQuery, useUpdateElementsMutation } from '../../frontend/element/elementApi';
import type { IElement } from '../../frontend/element/elementTypes';
import { setDeviceMode, toggleHover } from '../../frontend/renderer/rendererSlice';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import TabletAndroidIcon from '@mui/icons-material/TabletAndroid';
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';
import { openAlert } from '../../frontend/alert/alertSlice';
import type { ElementDoc } from '../../frontend/renderer/rendererTypes';

const PageEditor: React.FC = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const renderer = useAppSelector((state) => state.renderer)
  const pendingChanges = useAppSelector((state) => state.renderer.pendingChanges);
  const [updateElements] = useUpdateElementsMutation();
  
  const { data: rootPage } = useGetPageByIdQuery(id!);

  const { data: rootElement } = useGetElementsByIdQuery(
    rootPage?.rootElement ?? ''
  ) as { data?: IElement[] };

  if (!rootPage || !rootElement)
    return (
      <Box
        className="app-page"
        display="flex"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        width="100%"
        p={2}
      >
        <Alert severity="error">We couldn't find a page matching the given ID</Alert>
      </Box>
    );

  const handleHoverToggle = () => {
    dispatch(toggleHover())
  }

  const elementDocToIElement = (doc: ElementDoc): IElement => {
    return {
      _id: doc._id,
      component: doc.component,
      props: doc.props,
      childText: doc.childText,
      children: doc.children?.map(elementDocToIElement),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  };

  const handleSave = async () => {
    await Promise.all(
      Object.entries(pendingChanges).map(([id, doc]) =>
        updateElements({
          id,
          data: elementDocToIElement(doc),
        })
      )
    );

    dispatch(
      openAlert({
        severity: "success",
        body: "Changes saved successfully!",
        closeable: true,
        orientation: "bottom-right",
        entrance: "animate__fadeInRight",
        exit: "animate__fadeOutRight",
      })
    );
  };

  return (
    <Box
      bgcolor={theme.palette.neutral3.content}
      p={2}
      height="100%"
      display="flex"
      flexDirection="column"
    >
      <Box display="flex" flexDirection="row" alignItems="center" mb={2}>
        <Button
          variant={renderer.hover ? "contained" : "outlined"}
          color="primary"
          sx={{ bgcolor: renderer.hover ? theme.palette.primary.main : "transparent" }}
          onClick={handleHoverToggle}
        >
          hover
        </Button>

        <Box
          flex={1}
          display="flex"
          justifyContent="center"
        >
          <Button
            variant="outlined"
            onClick={() => dispatch(setDeviceMode("mobile"))}
            sx={{ mx: 0.5, bgcolor: renderer.mobile ? theme.palette.primary.main : "transparent", color: renderer.mobile ? theme.palette.primary.content : theme.palette.primary.main }}
          >
            <PhoneAndroidIcon />
          </Button>

          <Button
            variant="outlined"
            onClick={() => dispatch(setDeviceMode("tablet"))}
            sx={{ mx: 0.5, bgcolor: renderer.tablet ? theme.palette.primary.main : "transparent", color: renderer.tablet ? theme.palette.primary.content : theme.palette.primary.main }}
          >
            <TabletAndroidIcon />
          </Button>

          <Button
            variant="outlined"
            onClick={() => dispatch(setDeviceMode("desktop"))}
            sx={{ mx: 0.5, bgcolor: renderer.desktop ? theme.palette.primary.main : "transparent", color: renderer.desktop ? theme.palette.primary.content : theme.palette.primary.main }}
          >
            <DesktopWindowsIcon />
          </Button>
        </Box>

        <Button 
          variant={renderer.isDirty ? "outlined" : "contained"} 
          color="success" 
          sx={{ 
            bgcolor: "transparent", 
            cursor: renderer.isDirty ? 'pointer' : 'not-allowed',
            opacity: renderer.isDirty ? 1 : 0.5 
          }} 
          onClick={handleSave} 
        > 
          Save changes
        </Button>
        
      </Box>

      <Box flex={1} overflow="auto" m='auto' width={renderer.desktop ? '100%' : renderer.tablet ? '70%' : '400px'}>
        <Renderer element={rootElement[0]} editMode={true} />
      </Box>
    </Box>
  );
};

export default PageEditor;
