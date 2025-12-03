import React from "react";
import { componentMap } from "./componentMap";
import type { ElementDoc, RendererProps } from "./rendererTypes";
import type { Theme } from "@mui/material";
import { setSelectedElement } from "./rendererSlice";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";

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

  const children = elementToRender.children?.map((child: ElementDoc) => (
    <Renderer key={child._id} element={child} editMode={editMode} />
  ));

  const combinedSx = (theme: Theme) => ({
    ...(elementToRender.props?.sx || {}),
    ...(editMode
      ? {
          position: "relative",
          cursor: "pointer",
          outline: "1px dashed transparent",
          transition: "all 0.2s ease",
          "&:hover": {
            outline: `1px dashed ${theme.palette.primary.main}`,
            outlineOffset: 4,
          },
        }
      : {}),
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
        {children}
      </Component>
    </div>
  );
};

export default Renderer;
