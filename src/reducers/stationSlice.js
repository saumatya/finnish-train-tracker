import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const fetchStations = createAsyncThunk(
  "stations/fetchStations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "https://rata.digitraffic.fi/api/v1/metadata/stations"
      );
      return response.data;
    } catch (error) {
      const message = "Error deleting devices: " + error.message;
      toast.error(message);
      return rejectWithValue(error.message);
    }
  }
);
const stationSlice = createSlice({
  name: "stations",
  initialState: { stations: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchStations.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchStations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.stations = action.payload;
      })
      .addCase(fetchStations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default stationSlice.reducer;
