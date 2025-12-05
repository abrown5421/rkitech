import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { EditorState, ElementDoc } from "../renderer/rendererTypes";

const initialState: EditorState = {
  originalElement: null,
  draftElement: null,
  pendingChanges: {},
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
      if (state.draftElement && state.isDirty) {
        state.pendingChanges[state.draftElement._id] = state.draftElement;
      }
      const newElement = action.payload;
      const hasPendingChanges = state.pendingChanges[newElement._id];      
      state.originalElement = newElement;
      state.draftElement = hasPendingChanges 
        ? state.pendingChanges[newElement._id]
        : JSON.parse(JSON.stringify(newElement));
      state.isDirty = !!hasPendingChanges;
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
      if (state.isDirty) {
        state.pendingChanges[state.draftElement._id] = state.draftElement;
      } else {
        delete state.pendingChanges[state.draftElement._id];
      }
    },

    resetDraft(state) {
      if (!state.originalElement) return;
      state.draftElement = JSON.parse(JSON.stringify(state.originalElement));
      state.isDirty = false;
      if (state.originalElement._id) {
        delete state.pendingChanges[state.originalElement._id];
      }
    },
    
    clearPendingChanges(state) {
      state.pendingChanges = {};
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
