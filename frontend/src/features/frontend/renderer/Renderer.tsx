import React, { useState } from "react";
import { componentMap } from "./componentMap";
import type { RendererProps } from "./rendererTypes";
import { Box, IconButton, Tooltip, useMediaQuery, useTheme, type Theme } from "@mui/material";
import { addPendingDelete, setSelectedElement } from "./rendererSlice";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { useGetElementsByIdQuery } from "../element/elementApi";
import type { IElement } from "../element/elementTypes";
import { useDroppable } from "@dnd-kit/core";
import { Delete, Edit, OpenWith } from "@mui/icons-material";

const Renderer: React.FC<RendererProps> = ({ element, editMode }) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const selected = useAppSelector((state) => state.renderer.originalElement);
  const draft = useAppSelector((state) => state.renderer.draftElement);
  const pendingChanges = useAppSelector((state) => state.renderer.pendingChanges);
  const pendingCreates = useAppSelector((state) => state.renderer.pendingCreates);
  const deletions = useAppSelector((state) => state.renderer.pendingDeletes);

  const deviceMode = useAppSelector((state) => {
    if (state.renderer.mobile) return "mobile";
    if (state.renderer.tablet) return "tablet";
    return "desktop";
  });

  const elementToRender =
    editMode && selected && draft && selected._id === element._id
      ? draft
      : editMode && pendingChanges[element._id]
      ? pendingChanges[element._id]
      : element;

  const isDeleted = editMode && deletions.includes(elementToRender._id);
  
  const useViewportSize = () => {
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    if (isMobile) return "mobile";
    if (isTablet) return "tablet";
    return "desktop";
  };

  const viewportSize = editMode ? deviceMode : useViewportSize();

  const [hoveredElementId, setHoveredElementId] = useState<string | null>(null);
  const [isChildHovered, setIsChildHovered] = useState(false);

  const combinedSx = (theme: Theme) => {
    const baseProps = elementToRender.props || {};
    const responsiveProps = baseProps.responsive || {};

    let mergedSx = { ...(baseProps.sx || {}) };

    if (editMode) {
      if (deviceMode === "mobile" && responsiveProps.mobile) {
        const { variant, ...mobileSx } = responsiveProps.mobile;
        mergedSx = { ...mergedSx, ...mobileSx };
      } else if (deviceMode === "tablet" && responsiveProps.tablet) {
        const { variant, ...tabletSx } = responsiveProps.tablet;
        mergedSx = { ...mergedSx, ...tabletSx };
      }
    } else {
      if (responsiveProps.mobile) {
        const { variant, ...mobileSx } = responsiveProps.mobile;
        mergedSx = { ...mergedSx, [theme.breakpoints.down("sm")]: mobileSx };
      }
      if (responsiveProps.tablet) {
        const { variant, ...tabletSx } = responsiveProps.tablet;
        mergedSx = { ...mergedSx, [theme.breakpoints.between("sm", "md")]: tabletSx };
      }
    }

    if (editMode) {
      const shouldShowHover = 
        hoveredElementId === elementToRender._id && !isChildHovered;
      
      mergedSx = {
        ...mergedSx,
        cursor: "pointer",
        position: "relative",
        outlineOffset: 2,
        outline: shouldShowHover
          ? `2px dashed ${theme.palette.primary.main}`
          : "2px dashed transparent",
        transition: "all 0.2s ease-in-out",
      };
    }

    return {
      ...mergedSx,
      "&:active": baseProps.states?.active || {},
      "&:focus": baseProps.states?.focus || {},
    };
  };

  const getActiveProps = () => {
    const baseProps = { ...elementToRender.props };
    const responsiveProps = baseProps.responsive || {};

    if (viewportSize === "mobile" && responsiveProps.mobile) {
      return { ...baseProps, ...responsiveProps.mobile };
    } else if (viewportSize === "tablet" && responsiveProps.tablet) {
      return { ...baseProps, ...responsiveProps.tablet };
    }

    return baseProps;
  };

  const activeProps = getActiveProps();

  const deleteElement = (id: string) => {
    if (editMode) {
      dispatch(addPendingDelete(id))
    } 
  };

  const editElement = (e: React.MouseEvent) => {
    if (editMode) {
      e.stopPropagation();
      dispatch(setSelectedElement(element));
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setHoveredElementId(elementToRender._id);
    if (e.currentTarget.parentElement) {
      const parentMouseEnter = new CustomEvent('childHovered', { 
        bubbles: true,
        detail: { childId: elementToRender._id }
      });
      e.currentTarget.dispatchEvent(parentMouseEnter);
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setHoveredElementId((current) =>
      current === elementToRender._id ? null : current
    );
    setIsChildHovered(false);
    if (e.currentTarget.parentElement) {
      const parentMouseLeave = new CustomEvent('childUnhovered', { 
        bubbles: true,
        detail: { childId: elementToRender._id }
      });
      e.currentTarget.dispatchEvent(parentMouseLeave);
    }
  };

  const handleChildHovered = (e: Event) => {
    const customEvent = e as CustomEvent;
    if (customEvent.detail.childId !== elementToRender._id) {
      setIsChildHovered(true);
    }
  };

  const handleChildUnhovered = () => {
    setIsChildHovered(false);
  };

  React.useEffect(() => {
    const element = document.querySelector(`[data-element-id="${elementToRender._id}"]`);
    if (element) {
      element.addEventListener('childHovered', handleChildHovered as EventListener);
      element.addEventListener('childUnhovered', handleChildUnhovered);
      return () => {
        element.removeEventListener('childHovered', handleChildHovered as EventListener);
        element.removeEventListener('childUnhovered', handleChildUnhovered);
      };
    }
  }, [elementToRender._id]);

  const renderHoverButtons = (id: string) => {
    const isHovered = hoveredElementId === elementToRender._id && !isChildHovered;
    if (!editMode || !isHovered) return null;

    const buttonSize = 24;

    const placeholderAction = (actionName: string) => () => {
      console.log(`${actionName} clicked for element ${elementToRender._id}`);
    };

    return (
      <Box
        sx={{
          position: "absolute",
          top: -4,
          right: -4,
          padding: '2px',
          display: "flex",
          gap: 1,
          zIndex: 10,
          bgcolor: 'rgba(0, 0, 0, 0.8)',
          borderRadius: 1,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Tooltip title="Move element">
          <IconButton
            size="small"
            color="primary"
            onClick={placeholderAction("Move")}
            sx={{ width: buttonSize, height: buttonSize }}
          >
            <OpenWith fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit element">
          <IconButton
            size="small"
            color="primary"
            onClick={editElement}
            sx={{ width: buttonSize, height: buttonSize }}
          >
            <Edit fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete element">
          <IconButton
            size="small"
            color="primary"
            onClick={() => deleteElement(id)}
            sx={{ width: buttonSize, height: buttonSize }}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    );
  };

  const childIds = (elementToRender.children as string[] | undefined) || [];

  const DbChildRenderer: React.FC<{
    childId: string;
    editMode?: boolean;
    parentId?: string;
  }> = ({ childId, editMode, parentId }) => {
    const { data } = useGetElementsByIdQuery(childId);
    const child = (data as IElement[] | undefined)?.[0];

    if (!child) return null;

    return (
      <Renderer
        element={child}
        editMode={editMode}
        parentId={parentId}
      />
    );
  };

  const childrenElements = childIds.map((childId) => {
    if (editMode && deletions.includes(childId)) return null;

    if (pendingCreates[childId]) {
      return (
        <Renderer
          key={childId}
          element={pendingCreates[childId]}
          editMode={editMode}
          parentId={elementToRender._id}
        />
      );
    }

    if (pendingChanges[childId]) {
      return (
        <Renderer
          key={childId}
          element={pendingChanges[childId]}
          editMode={editMode}
          parentId={elementToRender._id}
        />
      );
    }

    return (
      <DbChildRenderer
        key={childId}
        childId={childId}
        editMode={editMode}
        parentId={elementToRender._id}
      />
    );
  });

  const isDroppable = elementToRender.droppable;

  const droppable = useDroppable({
    id: elementToRender._id,
    disabled: !isDroppable,
    data: elementToRender, 
  });

  const ref = isDroppable ? droppable.setNodeRef : undefined;

  const isOver = droppable.isOver && isDroppable;

  const dropSx = isOver
    ? { outline: `2px solid ${theme.palette.success.main}` }
    : {};

  if (elementToRender.component === "image") {
    if (isDeleted) return null;

    return (
      <Box
        ref={ref}
        sx={{ 
          position: 'relative', 
          display: 'inline-block',
          ...combinedSx(theme),
          ...dropSx,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        data-element-id={elementToRender._id}
      >
        <Box
          component="img"
          src={activeProps.src}
          alt={activeProps.alt ?? ""}
          sx={{ 
            display: 'block',
            maxWidth: '100%',
            pointerEvents: 'none'
          }}
        />
        {renderHoverButtons(elementToRender._id)}
      </Box>
    );
  }

  const Component = componentMap[elementToRender.component];
  if (!Component) return <div>Unknown component: {elementToRender.component}</div>;
  if (isDeleted) return null;
  
  return (
    <Component
      ref={ref}
      {...activeProps}
      sx={{ 
        ...combinedSx(theme),
        ...dropSx,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-element-id={elementToRender._id}
    >
      {elementToRender.childText}
      {childrenElements}
      {renderHoverButtons(elementToRender._id)}
    </Component>
  );
};

export default Renderer;