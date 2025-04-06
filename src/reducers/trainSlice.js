import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchTrainLocations = createAsyncThunk(
  "trains/fetch",
  async () => {
    const response = await axios.get("http://127.0.0.1:8000/trains");
    return response.data;
  }
);

const trainSlice = createSlice({
  name: "trains",
  initialState: { trains: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrainLocations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTrainLocations.fulfilled, (state, action) => {
        state.loading = false;
        state.trains = action.payload;
      })
      .addCase(fetchTrainLocations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default trainSlice.reducer;
