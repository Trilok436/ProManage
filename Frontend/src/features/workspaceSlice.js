import { createSlice } from "@reduxjs/toolkit";

const workspaceSlice = createSlice({
  name: "workspace",
  initialState: {
    workspaces: [],     // MUST be array
    currentWorkspace: null
},
  reducers: {
    setWorkspaces: (state, action) => {
    state.workspaces = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];
}
,
    setCurrentWorkspace: (state, action) => {
      state.currentWorkspace = action.payload;
    },
  },
});

export const { setWorkspaces, setCurrentWorkspace } = workspaceSlice.actions;
export default workspaceSlice.reducer;