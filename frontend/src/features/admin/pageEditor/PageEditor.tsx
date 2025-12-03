import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetPageByIdQuery } from '../../frontend/page/pageApi';
import Renderer from '../../frontend/renderer/Renderer';
import { Alert, Box } from '@mui/material';
import { useGetElementsByIdQuery } from '../../frontend/element/elementApi';
import type { IElement } from '../../frontend/element/elementTypes';

const PageEditor: React.FC = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const { data: rootPage } = useGetPageByIdQuery(id!);

  const { data: rootElement } = useGetElementsByIdQuery(
    rootPage?.rootElement ?? ''
  ) as { data?: IElement[] };

  useEffect(() => {
    console.log(rootElement);
  }, [rootElement]);

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

  return <Renderer element={rootElement[0]} editMode={true} />;
};

export default PageEditor;
