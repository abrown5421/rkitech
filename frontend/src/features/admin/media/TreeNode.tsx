import React, { useState } from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
  useTheme,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import type { TreeNodeProps } from "./mediaTypes";

const TreeNode: React.FC<TreeNodeProps> = ({ node, level = 0 }) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const isFolder = node.type === "folder";

  if (isFolder) {
    return (
      <Box
        sx={{
          borderRadius: 1,
          overflow: "hidden",
          boxShadow: "0px 2px 6px rgba(0,0,0,0.1)", 
        }}
      >
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => setOpen(!open)}
            sx={{
              bgcolor: theme.palette.neutral3.main,
              pl: 1,
            }}
          >
            <ListItemIcon>
              <FolderIcon />
            </ListItemIcon>
            <ListItemText primary={node.name} />
          </ListItemButton>
        </ListItem>

        <Collapse in={open} timeout="auto" unmountOnExit>
          <List disablePadding>
            {node.children?.map((child) => (
              <TreeNode key={child.path} node={child} level={level + 1} />
            ))}
          </List>
        </Collapse>
      </Box>
    );
  }

  return (
    <ListItem>
        <ListItemIcon>
          <InsertDriveFileIcon />
        </ListItemIcon>
        <ListItemText primary={node.name} />
    </ListItem>
  );
};

export default TreeNode;
