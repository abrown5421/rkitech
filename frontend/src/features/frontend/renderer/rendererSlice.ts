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
      if (state.draftElement && 
          JSON.stringify(state.draftElement) !== JSON.stringify(state.originalElement)) {
        state.pendingChanges[state.draftElement._id] = state.draftElement;
      }

      const newElement = action.payload;
      const hasPending = state.pendingChanges[newElement._id];

      state.originalElement = newElement;
      state.draftElement = hasPending
        ? state.pendingChanges[newElement._id]
        : JSON.parse(JSON.stringify(newElement));

      state.isDirty = Object.keys(state.pendingChanges).length > 0;
    },

    updateDraft(state, action: PayloadAction<Partial<ElementDoc>>) {
      if (!state.draftElement) return;

      state.draftElement = {
        ...state.draftElement,
        ...action.payload,
      };

      const elementChanged =
        JSON.stringify(state.draftElement) !==
        JSON.stringify(state.originalElement);

      if (elementChanged) {
        state.pendingChanges[state.draftElement._id] = state.draftElement;
      } else {
        delete state.pendingChanges[state.draftElement._id];
      }

      state.isDirty = Object.keys(state.pendingChanges).length > 0;
    },

    resetDraft(state) {
      if (!state.originalElement) return;

      state.draftElement = JSON.parse(JSON.stringify(state.originalElement));
      delete state.pendingChanges[state.originalElement._id];

      state.isDirty = Object.keys(state.pendingChanges).length > 0;
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
