import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { BoxEditorState } from './boxEditorTypes';

const initialState: BoxEditorState = {
  display: 'flex',
  m: '0px',
  p: '0px',
  width: '100%',
  height: '100px',
  bgcolor: '#f0f0f0',
};

export const boxEditorSlice = createSlice({
  name: 'boxEditor',
  initialState,
  reducers: {
    updateBoxProps: (state, action: PayloadAction<Partial<BoxEditorState>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { updateBoxProps } = boxEditorSlice.actions;
export default boxEditorSlice.reducer;
