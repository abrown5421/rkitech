import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { EditorState, ElementDoc } from "../renderer/rendererTypes";

const initialState: EditorState = {
  originalElement: null,
  draftElement: null,
  isDirty: false,
  hover: false,
  mobile: false,
  tablet: false,
  desktop: true,
};

export const editorSlice = createSlice({
  name: "renderer",
  initialState,
  reducers: {
    setSelectedElement(state, action: PayloadAction<ElementDoc>) {
      state.originalElement = action.payload;
      state.draftElement = JSON.parse(JSON.stringify(action.payload)); 
      state.isDirty = false;
    },

    updateDraft(state, action: PayloadAction<Partial<ElementDoc>>) {
      if (!state.draftElement) return;

      state.draftElement = {
        ...state.draftElement,
        ...action.payload,
      };

      state.isDirty =
        JSON.stringify(state.draftElement) !==
        JSON.stringify(state.originalElement);
    },

    resetDraft(state) {
      if (!state.originalElement) return;
      state.draftElement = JSON.parse(JSON.stringify(state.originalElement));
      state.isDirty = false;
    },

    toggleHover(state) {
      state.hover = !state.hover;
    },
    
    setDeviceMode(state, action: PayloadAction<"mobile" | "tablet" | "desktop">) {
      state.mobile = action.payload === "mobile";
      state.tablet = action.payload === "tablet";
      state.desktop = action.payload === "desktop";
    }
  },
});

export const { setSelectedElement, updateDraft, resetDraft, toggleHover, setDeviceMode } =
  editorSlice.actions;

export default editorSlice.reducer;
