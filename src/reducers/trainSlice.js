import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchTrainLocations = createAsyncThunk(
  "trains/fetch",
  async () => {
    const response = await axios.get(
      "https://rata.digitraffic.fi/api/v1/train-locations/latest"
    );
    return response.data;
  }
);

// Fetch station locations
export const fetchStations = createAsyncThunk("stations/fetch", async () => {
  const response = await axios.get(
    "https://rata.digitraffic.fi/api/v1/metadata/stations"
  );
  return response.data;
});

const trainSlice = createSlice({
  name: "trains",
  initialState: { trains: [], stations: [], loading: false, error: null },
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
      })

      // Station locations
      .addCase(fetchStations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStations.fulfilled, (state, action) => {
        state.loading = false;
        state.stations = action.payload;
      })
      .addCase(fetchStations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default trainSlice.reducer;
