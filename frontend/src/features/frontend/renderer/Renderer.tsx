import React from "react";
import { componentMap } from "./componentMap";
import type { ElementDoc, RendererProps } from "./rendererTypes";

const Renderer: React.FC<RendererProps> = ({ element }) => {
  const Component = componentMap[element.component];

  if (!Component) {
    return <div>Unknown component: {element.component}</div>;
  }

  const children = element.children?.map((child: ElementDoc) => (
    <Renderer key={child._id} element={child} />
  ));

  return (
    <Component {...element.props}>
      {element.childText}
      {children}
    </Component>
  );
};

export default Renderer;
