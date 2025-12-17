import React, { type JSX } from "react";
import { componentMap } from "./componentMap";
import type { RendererProps } from "./rendererTypes";
import { Box, Tooltip, useMediaQuery, useTheme } from "@mui/material";
import { setSelectedElement } from "./rendererSlice";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { useGetElementsByIdQuery } from "../element/elementApi";
import type { IElement } from "../element/elementTypes";
import { useDroppable } from "@dnd-kit/core";
import type { ElementDoc } from "./rendererTypes";

const Renderer: React.FC<RendererProps> = ({ element, editMode }) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const selected = useAppSelector((state) => state.renderer.originalElement);
  const draft = useAppSelector((state) => state.renderer.draftElement);
  const pendingChanges = useAppSelector((state) => state.renderer.pendingChanges);
  const pendingCreates = useAppSelector((state) => state.renderer.pendingCreates);

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

  const useViewportSize = () => {
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    if (isMobile) return "mobile";
    if (isTablet) return "tablet";
    return "desktop";
  };

  const viewportSize = editMode ? deviceMode : useViewportSize();

  const combinedSx = () => {
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

    return {
      ...mergedSx,
      ...(editMode
        ? {
            position: "relative",
            cursor: "pointer",
            outline: "2px dashed transparent",
            transition: "all 0.2s ease",
            "&:hover": {
              outline: `2px dashed ${theme.palette.primary.main}`,
              ...(baseProps.states?.hover || {}),
            },
          }
        : {
            "&:hover": baseProps.states?.hover || {},
          }),
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

  const handleClick = (e: React.MouseEvent) => {
    if (editMode) {
      e.stopPropagation();
      dispatch(setSelectedElement(element));
    }
  };

  const getChildren = () => {
    const children = elementToRender.children || [];
    const childElements: JSX.Element[] = [];

    children.forEach((child) => {
      if (typeof child === 'object' && child._id) {
        const childDoc = child as ElementDoc;
        if (pendingCreates[childDoc._id]) {
          childElements.push(
            <Renderer key={childDoc._id} element={pendingCreates[childDoc._id]} editMode={editMode} />
          );
        } else {
          childElements.push(
            <Renderer key={childDoc._id} element={childDoc} editMode={editMode} />
          );
        }
      }
      else if (typeof child === 'string') {
        const childId = child;
        
        if (pendingCreates[childId]) {
          childElements.push(
            <Renderer key={childId} element={pendingCreates[childId]} editMode={editMode} />
          );
        } else {
          const { data: childData } = useGetElementsByIdQuery(childId);
          const childElement = (childData as IElement[] | undefined)?.[0];
          
          if (childElement) {
            childElements.push(
              <Renderer key={childId} element={childElement} editMode={editMode} />
            );
          } else {
            childElements.push(
              <div key={childId}>Child not found</div>
            );
          }
        }
      }
    });

    return childElements;
  };

  const childrenElements = getChildren();

  const tooltipTitle = `Open ${element.component} element?`;
  
  if (elementToRender.component === "image") {
    return (
      <Tooltip
        title={editMode ? tooltipTitle : ""}
        placement="bottom"
        arrow
        followCursor
        disableHoverListener={!editMode}
        disableFocusListener={!editMode}
        disableTouchListener={!editMode}
      >
        <Box
          component="img"
          src={activeProps.src}
          alt={activeProps.alt ?? ""}
          sx={combinedSx}
          onClick={handleClick}
        />
      </Tooltip>
    );
  }

  const Component = componentMap[elementToRender.component];
  if (!Component) return <div>Unknown component: {elementToRender.component}</div>;

  const isDroppable = editMode && elementToRender.droppable;

  const { 
    setNodeRef, 
    //isOver
  } = useDroppable({
    id: elementToRender._id,
    data: elementToRender,
    disabled: !isDroppable,
  });

  return (
    <Tooltip
      title={editMode ? tooltipTitle : ""}
      placement="bottom"
      arrow
      followCursor
      disableHoverListener={!editMode}
      disableFocusListener={!editMode}
      disableTouchListener={!editMode}
    >
      <Component 
        ref={setNodeRef} 
        {...activeProps} 
        sx={combinedSx} 
        onClick={handleClick}
      >
        {elementToRender.childText}
        {childrenElements}
      </Component>
    </Tooltip>
  );
};

export default Renderer;