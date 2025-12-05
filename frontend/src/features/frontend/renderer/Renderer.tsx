import React from "react";
import { componentMap } from "./componentMap";
import type { RendererProps } from "./rendererTypes";
import { useMediaQuery, useTheme, type Theme } from "@mui/material";
import { setSelectedElement } from "./rendererSlice";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { useGetElementsByIdQuery } from "../element/elementApi";
import type { IElement } from "../element/elementTypes";

const Renderer: React.FC<RendererProps> = ({ element, editMode }) => {
  const dispatch = useAppDispatch();
  const selected = useAppSelector((state) => state.renderer.originalElement);
  const draft = useAppSelector((state) => state.renderer.draftElement);
  const pendingChanges = useAppSelector((state) => state.renderer.pendingChanges);
  
  const deviceMode = useAppSelector((state) => {
    if (state.renderer.mobile) return 'mobile';
    if (state.renderer.tablet) return 'tablet';
    return 'desktop';
  });

  const elementToRender =
    editMode && selected && draft && selected._id === element._id
      ? draft 
      : editMode && pendingChanges[element._id]
      ? pendingChanges[element._id] 
      : element;

  const Component = componentMap[elementToRender.component];
  if (!Component) {
    return <div>Unknown component: {elementToRender.component}</div>;
  }

  const childrenElements = (elementToRender.children as string[] | undefined)?.map((childId) => {
    const { data: childArray } = useGetElementsByIdQuery(childId);
    const child = (childArray as IElement[] | undefined)?.[0];

    if (!child) return <div key={childId}>Child not found</div>;

    return <Renderer key={child._id} element={child} editMode={editMode} />;
  });

  const useViewportSize = () => {
    const theme = useTheme();
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    if (isMobile) return 'mobile';
    if (isTablet) return 'tablet';
    return 'desktop';
  };
  
  const viewportSize = editMode ? deviceMode : useViewportSize();

  const combinedSx = (theme: Theme) => {
    const baseProps = elementToRender.props || {};
    const responsiveProps = baseProps.responsive || {};
    
    let mergedSx = { ...(baseProps.sx || {}) };
    
    if (editMode) {
      if (deviceMode === 'mobile' && responsiveProps.mobile) {
        const { variant, ...mobileSxProps } = responsiveProps.mobile;
        mergedSx = { ...mergedSx, ...mobileSxProps };
      } else if (deviceMode === 'tablet' && responsiveProps.tablet) {
        const { variant, ...tabletSxProps } = responsiveProps.tablet;
        mergedSx = { ...mergedSx, ...tabletSxProps };
      }
    } 
    else {
      if (responsiveProps.mobile) {
        const { variant, ...mobileSxProps } = responsiveProps.mobile;
        mergedSx = {
          ...mergedSx,
          [theme.breakpoints.down('sm')]: mobileSxProps
        };
      }
      
      if (responsiveProps.tablet) {
        const { variant, ...tabletSxProps } = responsiveProps.tablet;
        mergedSx = {
          ...mergedSx,
          [theme.breakpoints.between('sm', 'md')]: tabletSxProps
        };
      }
    }
    
    return {
      ...mergedSx,
      ...(editMode ? {
        position: "relative",
        cursor: "pointer",
        outline: "1px dashed transparent",
        transition: "all 0.2s ease",
        "&:hover": {
          boxShadow: `0 0 0 2px ${theme.palette.primary.main} inset`,
          ...(baseProps.states?.hover || {}),
        },
      } : {
        "&:hover": baseProps.states?.hover || {},
      }),
      "&:active": baseProps.states?.active || {},
      "&:focus": baseProps.states?.focus || {},
    };
  };

  const getActiveProps = () => {
    const baseProps = { ...elementToRender.props };
    const responsiveProps = baseProps.responsive || {};
    
    if (viewportSize === 'mobile' && responsiveProps.mobile) {
      return { ...baseProps, ...responsiveProps.mobile };
    } else if (viewportSize === 'tablet' && responsiveProps.tablet) {
      return { ...baseProps, ...responsiveProps.tablet };
    }
    
    return baseProps;
  };

  const activeProps = getActiveProps();
  
  const combinedProps = {
    ...activeProps,
    sx: combinedSx,
  };

  const handleClick = (e: React.MouseEvent) => {
    if (editMode) {
      e.stopPropagation();
      dispatch(setSelectedElement(element));
    }
  };

  return (
    <div onClick={handleClick} style={{ display: "contents" }}>
      <Component {...combinedProps}>
        {elementToRender.childText}
        {childrenElements}
      </Component>
    </div>
  );
};

export default Renderer;
