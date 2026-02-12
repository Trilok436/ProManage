import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../hooks/useAxios";

const API = "http://localhost:8080/api";

export const fetchTasksByProject = createAsyncThunk(
  "tasks/fetchByProject",
  async (projectId) => {
    const res = await api.get(`${API}/tasks/project/${projectId}`);
    return res.data;
  }
);

export const updateTaskStatus = createAsyncThunk(
  "tasks/updateStatus",
  async ({ taskId, status }) => {
    // Make sure to use the full URL path: http://localhost:8080/api/tasks/...
    const response = await api.put(`${API}/tasks/${taskId}/status`, { status: status });
    return response.data;
  }
);

export const deleteTasks = createAsyncThunk(
  "tasks/deleteMany",
  async ({ ids, projectId }) => {
    await Promise.all(ids.map((id) => api.delete(`${API}/tasks/${id}`)));
    const res = await api.get(`${API}/tasks/project/${projectId}`);
    return res.data;
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState: { tasks: [] },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasksByProject.fulfilled, (state, action) => {
        state.tasks = action.payload;
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
  // Replace the old task with the updated one in the list
  state.tasks = state.tasks.map((task) =>
    task.id === action.payload.id ? action.payload : task
  );
})
      .addCase(deleteTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
      });
  },
});

export default taskSlice.reducer;