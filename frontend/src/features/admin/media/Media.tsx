import React, { useState } from 'react';
import { Box, Typography, Collapse, List, ListItem, ListItemText, IconButton, Button } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useGetMediaTreeQuery } from './mediaApi';

const MediaNode: React.FC<{ node: MediaNodeType; onSelect: (node: MediaNodeType) => void }> = ({ node, onSelect }) => {
  const [open, setOpen] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  const handleClick = () => {
    if (hasChildren) setOpen(!open);
    else onSelect(node);
  };

  return (
    <>
      <ListItem
        component="div"
        onClick={handleClick}
        sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
      >
        {hasChildren && (
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}
          >
            {open ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        )}
        <ListItemText primary={node.name} />
      </ListItem>

      {hasChildren && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 4 }}>
            {node.children!.map((child) => (
              <MediaNode key={child.name} node={child} onSelect={onSelect} />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

interface MediaNodeType {
  name: string;
  children?: MediaNodeType[];
  fullPath?: string;
}

const Media: React.FC = () => {
  const { data, isLoading } = useGetMediaTreeQuery();
  const [selected, setSelected] = useState<MediaNodeType | null>(null);

  const handleSelect = (node: MediaNodeType) => setSelected(node);

  if (isLoading) return <Typography>Loading media...</Typography>;

  return (
    <Box className="app-page" display="flex" flexDirection="row" width="100%" p={2}>
      <Box width="300px" p={2} borderRight="1px solid #ccc" height="100%" overflow="auto">
        <Typography variant="h6">Media Browser</Typography>
        <List>
          {data && <MediaNode node={data} onSelect={handleSelect} />}
        </List>
      </Box>

      <Box flex={1} p={2}>
        <Typography variant="h6">Selected</Typography>
        {selected ? <Typography>{selected.name}</Typography> : <Typography>No file selected</Typography>}
        <Box mt={2} display="flex" gap={2}>
          <Button variant="contained" disabled>Upload</Button>
          <Button variant="outlined" color="error" disabled={!selected}>Delete</Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Media;
