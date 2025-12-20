import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Box } from "@mui/material";
import React from "react";
import type { DraggableElementProps } from "./elementBankTypes";

const DraggableElement: React.FC<DraggableElementProps> = ({
  id,
  children,
  sx,
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
      data: {
        source: "element-bank",
        component: id,
      },
    });

  return (
    <Box
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      sx={{
        cursor: "grab",
        opacity: isDragging ? 0.5 : 1,
        transform: CSS.Translate.toString(transform),
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export default DraggableElement;
