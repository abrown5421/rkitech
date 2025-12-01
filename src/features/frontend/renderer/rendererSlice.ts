import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ElementDoc } from "./rendererTypes";

const initialElement: ElementDoc = {
  _id: "root",
  component: "box",
  props: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    p: "16px",
    bgcolor: "#f0f0f0",
  },
  children: [
    {
      _id: "t1",
      component: "typography",
      props: { variant: "h4" },
      childText: "Hello world!",
    },
    {
      _id: "t2",
      component: "typography",
      props: { color: "primary.main" },
      childText: "Second piece of text",
    },
  ],
};

export const rendererSlice = createSlice({
  name: "renderer",
  initialState: { root: initialElement },
  reducers: {
    updateElementProps: (
      state,
      action: PayloadAction<{ _id: string; props: Record<string, any>; childText?: string }>
    ) => {
      const { _id, props, childText } = action.payload;

      const updateRecursive = (element: ElementDoc) => {
        if (element._id === _id) {
          element.props = { ...element.props, ...props };
          if (childText !== undefined) element.childText = childText;
        }
        element.children?.forEach(updateRecursive);
      };

      updateRecursive(state.root);
    },
  },
});

export const { updateElementProps } = rendererSlice.actions;
export default rendererSlice.reducer;
