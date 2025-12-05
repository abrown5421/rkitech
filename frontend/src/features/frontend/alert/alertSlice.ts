import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AlertProps } from "./alertTypes";

const initialState: AlertProps = {
    open: false,
    body: "",
    closeable: true,
    severity: "success",
    entrance: "animate__fadeInRight",
    exit: "animate__fadeOutRight",
    orientation: "bottom-right", 
};

const alertSlice = createSlice({
    name: "alert",
    initialState,
    reducers: {
        openAlert: (state, action: PayloadAction<Omit<AlertProps, "open">>) => {
            state.open = true;
            state.body = action.payload.body;
            state.closeable = action.payload.closeable;
            state.severity = action.payload.severity;
            state.entrance = action.payload.entrance;
            state.exit = action.payload.exit;
            state.orientation = action.payload.orientation;
        },
        closeAlert: (state) => {
            state.open = false;
            state.body = "";
            state.closeable = true;
            state.severity = "success";
            state.entrance = undefined;
            state.exit = undefined;
            state.orientation = "bottom-right"; 
        },
    },
});

export const {
    openAlert,
    closeAlert, 
} = alertSlice.actions;

export default alertSlice.reducer;