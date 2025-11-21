import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { DynamicFormProps } from "./dynamicFormTypes";

const defaultDynamicFormState: DynamicFormProps = {
  open: false,
  screenPercentage: 25,
  entrance: undefined, 
  exit: undefined,
  backgroundColor: "",
  isClosing: false,
  title: "",
  formFields: [],
  mode: 'create',
  editingItem: undefined
};

const initialState: DynamicFormProps = { ...defaultDynamicFormState };

export const dynamicFormSlice = createSlice({
  name: "dynamicForm",
  initialState,
  reducers: {
    openDynamicForm: (_state, action: PayloadAction<DynamicFormProps>) => {
      return { ...action.payload, open: true };
    },
    preCloseDynamicForm: (state) => {
      return { ...state, isClosing: true };
    },
    closeDynamicForm: () => {
      return { ...defaultDynamicFormState };
    },
  },
});

export const { openDynamicForm, preCloseDynamicForm, closeDynamicForm } = dynamicFormSlice.actions;
export default dynamicFormSlice.reducer;
