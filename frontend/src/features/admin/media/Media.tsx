import React from "react";
import { Box, List, Typography } from "@mui/material";
import { useGetMediaTreeQuery } from "./mediaApi";
import TreeNode from "./TreeNode";

const Media: React.FC = () => {
  const { data, isLoading, error } = useGetMediaTreeQuery();

  if (isLoading) return <Typography>Loading media...</Typography>;
  if (error || !data) return <Typography>Error loading media.</Typography>;

  return (
    <Box p={2} width="100%">
      <Typography variant="h6" mb={2} fontFamily='primary'>
        Media Library
      </Typography>

      <List>
        {data.children.map((child) => (
          <TreeNode key={child.path} node={child} level={1} />
        ))}
      </List>
    </Box>
  );
};

export default Media;
