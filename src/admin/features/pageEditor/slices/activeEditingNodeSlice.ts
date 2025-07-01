import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ActiveEditingNodeState } from '../types/activeEditingNodeTypes';

const initialState: ActiveEditingNodeState = {
  nodeUUID: null,
  nodeType: null,
  nodePath: [],
};

const activeEditingNodeSlice = createSlice({
  name: 'activeEditingNode',
  initialState,
  reducers: {
    setActiveNode: (
      state,
      action: PayloadAction<{ uuid: string; type: string; path?: string[] }>
    ) => {
      state.nodeUUID = action.payload.uuid;
      state.nodeType = action.payload.type;
      state.nodePath = action.payload.path || [];
    },
    clearActiveNode: (state) => {
      state.nodeUUID = null;
      state.nodeType = null;
      state.nodePath = [];
    },
  },
});

export const { setActiveNode, clearActiveNode } = activeEditingNodeSlice.actions;

export default activeEditingNodeSlice.reducer;