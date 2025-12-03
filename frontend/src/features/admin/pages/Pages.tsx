import React from 'react';
import { Box, Typography } from '@mui/material';
import { useGetNonAdminPagesQuery } from '../../frontend/page/pageApi';

const Pages: React.FC = () => {
  const { data: pages } = useGetNonAdminPagesQuery();

  if (!pages) return null;

  return (
    <Box
        className="app-page"
        display='flex'
        flexDirection='row'
        width='100%'
        p={4}
    >
      {pages.map((p) => (
        <Typography key={p._id}>{p.pageName}</Typography> 
      ))}
    </Box>
  );
};

export default Pages;
