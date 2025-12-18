import type { ElementDoc } from "../../frontend/renderer/rendererTypes";

export const generateElementId = (): string => {
  return `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const createElementTemplate = (
  componentType: string
): ElementDoc => {
  const id = generateElementId();

  const templates: Record<string, ElementDoc> = {
    box: {
      _id: id,
      component: "box",
      props: {
        display: "flex",
        flexDirection: "column",
        p: 2,
        gap: 2,
      },
      droppable: true,
      children: [],
    },
    animation: {
      _id: id,
      component: "animation",
      props: {
        display: "flex",
        flexDirection: "column",
        p: 2,
        gap: 2,
        animationObject: {
          entranceAnimation: "animate__fadeIn",
          exitAnimation: "animate__fadeOut",
          isEntering: true,
        },
      },
      droppable: true,
      children: [],
    },
    typography: {
      _id: id,
      component: "typography",
      props: {
        variant: "body1",
        color: "#000000",
      },
      childText: "New Text",
      droppable: false,
      children: [],
    },
    button: {
      _id: id,
      component: "button",
      props: {
        variant: "contained",
        color: "primary",
      },
      childText: "Click Me",
      droppable: false,
      children: [],
    },
    image: {
      _id: id,
      component: "image",
      props: {
        src: "/images/placeholder.png",
        alt: "New image",
        sx: {
          width: 200,
          height: "auto",
        },
      },
      droppable: false,
      children: [],
    },
  };

  return templates[componentType] || templates.box;
};