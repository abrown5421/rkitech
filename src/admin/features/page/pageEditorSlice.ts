import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { PageEditorProps } from "./pageEditorTypes";
import type { Page } from "../../../shared/features/pages/pageTypes";

const initialState: PageEditorProps = {
  localPageCompKey: '',
  localPageObjectFromDb: null,
  activePrefix: undefined,
  activeEditorComponent: undefined,
  activeEditorUUID: undefined,
  enterExit: true,
};

const localPageSlice = createSlice({
  name: 'pageEditor',
  initialState,
  reducers: {
    setLocalPageState(state: PageEditorProps, action: PayloadAction<Partial<PageEditorProps>>) {
      Object.assign(state, action.payload);
    },
    setLocalPageCompKey(state: PageEditorProps, action: PayloadAction<string>) {
      state.localPageCompKey = action.payload;
    },
    setEnterExit(state: PageEditorProps, action: PayloadAction<boolean>) {
      state.enterExit = action.payload;
    },
    setLocalPageObject(state: PageEditorProps, action: PayloadAction<Page>) {
      state.localPageObjectFromDb = action.payload;
    },
    unsetLocalPageObject(state: PageEditorProps) {
      state.localPageObjectFromDb = null;
    },
    setActivePrefix(state: PageEditorProps, action: PayloadAction<PageEditorProps['activePrefix']>) {
      state.activePrefix = action.payload;
    },
    unsetActivePrefix(state: PageEditorProps) {
      state.activePrefix = undefined;
    },
    setActiveEditorComponent(state: PageEditorProps, action: PayloadAction<PageEditorProps['activeEditorComponent']>) {
      state.activeEditorComponent = action.payload;
    },
    unsetActiveEditorComponent(state: PageEditorProps) {
      state.activeEditorComponent = undefined;
    },
    setActiveEditorUUID(state: PageEditorProps, action: PayloadAction<string>) {
      state.activeEditorUUID = action.payload;
    },
    unsetActiveEditorUUID(state: PageEditorProps) {
      state.activeEditorUUID = undefined;
    },
    updatePageField<K extends keyof Page>(
      state: PageEditorProps,
      action: PayloadAction<{ field: K; value: Page[K] }>
    ) {
      if (state.localPageObjectFromDb) {
        state.localPageObjectFromDb[action.payload.field] = action.payload.value;
      }
    },
    updateNodeByUUID(
      state: PageEditorProps,
      action: PayloadAction<{ UUID: string; props: any }>
    ) {
      const { UUID, props } = action.payload;

      const updateNode = (node: any): boolean => {
        if (node.UUID === UUID) {
          node.props = props;
          return true; 
        }
        if (node.children && Array.isArray(node.children)) {
          for (let child of node.children) {
            if (updateNode(child)) {
              return true;
            }
          }
        }
        return false; 
      };

      if (state.localPageObjectFromDb) {
        updateNode(state.localPageObjectFromDb);
      }
    },
    resetLocalPageState(state: PageEditorProps) {
      state.localPageCompKey = '';
      state.localPageObjectFromDb = null;
      state.activePrefix = undefined;
      state.activeEditorComponent = undefined;
      state.activeEditorUUID = undefined;
    },
  },
});

export const {
  setLocalPageState,
  setLocalPageCompKey,
  setLocalPageObject,
  setEnterExit,
  unsetLocalPageObject,
  setActivePrefix,
  unsetActivePrefix,
  setActiveEditorComponent,
  unsetActiveEditorComponent,
  setActiveEditorUUID,
  unsetActiveEditorUUID,
  updateNodeByUUID,
  updatePageField,
  resetLocalPageState,
} = localPageSlice.actions;

export default localPageSlice.reducer;
