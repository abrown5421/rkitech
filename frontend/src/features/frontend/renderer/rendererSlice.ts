import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { EditorState, ElementDoc } from "../renderer/rendererTypes";

const initialState: EditorState = {
  originalElement: null,
  draftElement: null,
  pendingChanges: {},
  pendingCreates: {},
  pendingDeletes: {},
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
      state.pendingCreates = {};
      state.pendingDeletes = {};
      state.isDirty = false;
    },

    toggleHover(state) {
      state.hover = !state.hover;
    },
    
    setDeviceMode(state, action: PayloadAction<"mobile" | "tablet" | "desktop">) {
      state.mobile = action.payload === "mobile";
      state.tablet = action.payload === "tablet";
      state.desktop = action.payload === "desktop";
    },

    deselectElement(state) {
      state.originalElement = null;
      state.draftElement = null;
      state.isDirty = Object.keys(state.pendingChanges).length > 0;
    },

    addPendingElement(state, action: PayloadAction<{ element: ElementDoc; parentId: string }>) {
      const { element: newElement, parentId } = action.payload;
      state.pendingCreates[newElement._id] = newElement;

      if (state.pendingChanges[parentId]) {
        const parent = state.pendingChanges[parentId];
        parent.children = [...(parent.children || []), newElement];
      } 
      else if (state.pendingCreates[parentId]) {
        const parent = state.pendingCreates[parentId];
        parent.children = [...(parent.children || []), newElement];
      }

      state.originalElement = null;
      state.draftElement = newElement;
      state.isDirty = true;
    },

    addChildToParent(state, action: PayloadAction<{ parentId: string; childId: string; parentElement: ElementDoc }>) {
      const { parentId, childId, parentElement } = action.payload;
      
      if (state.pendingChanges[parentId]) {
        const parent = state.pendingChanges[parentId];
        if (!parent.children) {
          parent.children = [];
        }
        if (!parent.children.some(c => (typeof c === 'string' ? c : c._id) === childId)) {
          parent.children.push({ _id: childId } as ElementDoc);
        }
      } else {
        const updatedParent = JSON.parse(JSON.stringify(parentElement));
        if (!updatedParent.children) {
          updatedParent.children = [];
        }
        if (!updatedParent.children.some((c: ElementDoc | string) => (typeof c === 'string' ? c : c._id) === childId)) {
          updatedParent.children.push({ _id: childId } as ElementDoc);
        }
        state.pendingChanges[parentId] = updatedParent;
      }
      
      state.isDirty = true;
    },

    removePendingElement(state, action: PayloadAction<string>) {
      const id = action.payload;
      if (state.pendingCreates[id]) {
        delete state.pendingCreates[id];
      }

      if (state.draftElement?._id === id) {
        state.draftElement = null;
        state.originalElement = null;
      }

      state.isDirty =
        Object.keys(state.pendingChanges).length > 0 ||
        Object.keys(state.pendingCreates).length > 0 ||
        Object.keys(state.pendingDeletes).length > 0;
    },

    addPendingDelete(state, action: PayloadAction<string>) {
      const id = action.payload;

      if (state.pendingChanges[id]) {
        delete state.pendingChanges[id];
      }

      if (state.pendingCreates[id]) {
        delete state.pendingCreates[id];
      } else {
        state.pendingDeletes[id] = true;
      }

      if (state.draftElement?._id === id) {
        state.draftElement = null;
        state.originalElement = null;
      }

      state.isDirty =
        Object.keys(state.pendingChanges).length > 0 ||
        Object.keys(state.pendingCreates).length > 0 ||
        Object.keys(state.pendingDeletes).length > 0;
    },

    removePendingDelete(state, action: PayloadAction<string>) {
      const id = action.payload;
      if (state.pendingDeletes[id]) {
        delete state.pendingDeletes[id];
      }

      state.isDirty =
        Object.keys(state.pendingChanges).length > 0 ||
        Object.keys(state.pendingCreates).length > 0 ||
        Object.keys(state.pendingDeletes).length > 0;
    },

    resetRenderer() {
      return initialState;
    }
  },
});

export const { 
  setSelectedElement, 
  updateDraft, 
  resetDraft, 
  toggleHover, 
  setDeviceMode, 
  resetRenderer,
  deselectElement,
  addPendingElement,
  addChildToParent,
  removePendingElement,
  addPendingDelete,
  removePendingDelete,
  clearPendingChanges
} = editorSlice.actions;

export default editorSlice.reducer;