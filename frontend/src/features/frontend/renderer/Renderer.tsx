import React from "react";
import { componentMap } from "./componentMap";
import type { ElementDoc, RendererProps } from "./rendererTypes";
import type { Theme } from "@mui/material";

const Renderer: React.FC<RendererProps> = ({ element, editMode }) => {
  const Component = componentMap[element.component];

  if (!Component) {
    return <div>Unknown component: {element.component}</div>;
  }

  const children = element.children?.map((child: ElementDoc) => (
    <Renderer key={child._id} element={child} editMode={editMode} />
  ));

  const combinedSx = (theme: Theme) => ({
    ...(element.props?.sx || {}),
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
    ...element.props,
    sx: combinedSx,
  };

  return (
    <Component {...combinedProps}>
      {element.childText}
      {children}
    </Component>
  );
};

export default Renderer;
