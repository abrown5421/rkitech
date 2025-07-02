import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ActiveEditingNodeState } from '../types/activeEditingNodeTypes';

const initialState: ActiveEditingNodeState = {
  nodeUUID: null,
  nodeType: null,
  nodeProps: null,
};

const activeEditingNodeSlice = createSlice({
  name: 'activeEditingNode',
  initialState,
  reducers: {
    setActiveNode: (
      state,
      action: PayloadAction<{
        uuid: string;
        type: string;
        props: Record<string, any>;
      }>
    ) => {
      state.nodeUUID = action.payload.uuid;
      state.nodeType = action.payload.type;
      state.nodeProps = action.payload.props;
    },
    clearActiveNode: (state) => {
      state.nodeUUID = null;
      state.nodeType = null;
      state.nodeProps = null;
    },
  },
});

export const { setActiveNode, clearActiveNode } = activeEditingNodeSlice.actions;

export default activeEditingNodeSlice.reducer;
