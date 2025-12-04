import React from "react";
import { componentMap } from "./componentMap";
import type { RendererProps } from "./rendererTypes";
import type { Theme } from "@mui/material";
import { setSelectedElement } from "./rendererSlice";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { useGetElementsByIdQuery } from "../element/elementApi";
import type { IElement } from "../element/elementTypes";

const Renderer: React.FC<RendererProps> = ({ element, editMode }) => {
  const dispatch = useAppDispatch();
  const selected = useAppSelector((state) => state.renderer.originalElement);
  const draft = useAppSelector((state) => state.renderer.draftElement);

  const elementToRender =
    editMode && selected && draft && selected._id === element._id
      ? draft
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

  const combinedSx = (theme: Theme) => ({
    ...(elementToRender.props?.sx || {}),
    ...(editMode
      ? {
          position: "relative",
          cursor: "pointer",
          outline: "1px dashed transparent",
          transition: "all 0.2s ease",
          "&:hover": {
            boxShadow: `0 0 0 2px ${theme.palette.primary.main} inset`,
            ...(elementToRender.props?.states?.hover || {}),
          },
        }
      : {
          "&:hover": elementToRender.props?.states?.hover || {},
        }),
    "&:active": elementToRender.props?.states?.active || {},
    "&:focus": elementToRender.props?.states?.focus || {},
  });

  const combinedProps = {
    ...elementToRender.props,
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
