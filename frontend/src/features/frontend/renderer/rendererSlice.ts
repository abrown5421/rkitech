import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { EditorState, ElementDoc } from "../renderer/rendererTypes";

const initialState: EditorState = {
  originalElement: null,
  draftElement: null,
  pendingChanges: {},
  pendingCreates: {},
  pendingDeletes: [],
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
      state.pendingDeletes = [];
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

    addPendingDelete(state, action: PayloadAction<string>) {
      const elementIdToDelete = action.payload;
      
      if (!state.pendingDeletes.includes(elementIdToDelete)) {
        state.pendingDeletes.push(elementIdToDelete);
        
        const removeChildFromElement = (element: ElementDoc, childId: string) => {
          if (!element.children) return false;
          
          const originalLength = element.children.length;
          element.children = element.children.filter(child => {
            const id = typeof child === 'string' ? child : child._id;
            return id !== childId;
          });
          
          return element.children.length !== originalLength;
        };
        
        Object.entries(state.pendingChanges).forEach(([parentId, parent]) => {
          if (removeChildFromElement(parent, elementIdToDelete)) {
            state.pendingChanges[parentId] = parent;
          }
        });
        
        if (state.draftElement) {
          if (removeChildFromElement(state.draftElement, elementIdToDelete)) {
            state.pendingChanges[state.draftElement._id] = state.draftElement;
          }
        }
        
        state.isDirty = true;
      }
    },

    removePendingDelete(state, action: PayloadAction<string>) {
      state.pendingDeletes = state.pendingDeletes.filter(
        id => id !== action.payload
      );

      state.isDirty =
        Object.keys(state.pendingChanges).length > 0 ||
        Object.keys(state.pendingCreates).length > 0 ||
        state.pendingDeletes.length > 0;
    },

    resetPendingDeletes(state) {
      state.pendingDeletes = [];

      state.isDirty =
        Object.keys(state.pendingChanges).length > 0 ||
        Object.keys(state.pendingCreates).length > 0;
    },

    addPendingCreate(state, action: PayloadAction<{ element: ElementDoc; parentElement: ElementDoc }>) {
      const { element, parentElement } = action.payload;

      state.pendingCreates[element._id] = element;

      let updatedParent = state.pendingChanges[parentElement._id];
      
      if (!updatedParent) {
        updatedParent = JSON.parse(JSON.stringify(parentElement));
      }

      if (!updatedParent.children) {
        updatedParent.children = [];
      }
      
      const childIds = updatedParent.children.map(c => 
        typeof c === 'string' ? c : c._id
      );
      
      if (!childIds.includes(element._id)) {
        updatedParent.children.push(element._id);
      }

      state.pendingChanges[parentElement._id] = updatedParent;

      state.isDirty = true;
    },

    removePendingCreate(state, action: PayloadAction<string>) {
      delete state.pendingCreates[action.payload];

      state.isDirty =
        Object.keys(state.pendingChanges).length > 0 ||
        Object.keys(state.pendingCreates).length > 0 ||
        state.pendingDeletes.length > 0;
    },

    resetPendingCreates(state) {
      state.pendingCreates = {};

      state.isDirty =
        Object.keys(state.pendingChanges).length > 0 ||
        state.pendingDeletes.length > 0;
    },

    resetRenderer() {
      return initialState;
    },
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
  clearPendingChanges,
  addPendingDelete,
  removePendingDelete,
  resetPendingDeletes,
  addPendingCreate,
  removePendingCreate,
  resetPendingCreates,
} = editorSlice.actions;

export default editorSlice.reducer;