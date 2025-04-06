import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const fetchTrainLocations = createAsyncThunk(
  "trains/fetchTrainLocations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "https://rata.digitraffic.fi/api/v1/train-locations/latest"
      );
      return response.data;
    } catch (error) {
      const message = "Error deleting devices: " + error.message;
      toast.error(message);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchLiveTrains = createAsyncThunk(
  "trains/fetchLiveTrains",
  async (stationShortCode, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://rata.digitraffic.fi/api/v1/live-trains/station/${stationShortCode}?arrived_trains=5&arriving_trains=5&departed_trains=5&departing_trains=5&include_nonstopping=false`
      );
      return response.data;
    } catch (error) {
      const message = "Error deleting devices: " + error.message;
      toast.error(message);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchLiveArrivalTrains = createAsyncThunk(
  "trains/fetchLiveArrivalTrains",
  async (stationShortCode, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://rata.digitraffic.fi/api/v1/live-trains/station/${stationShortCode}?arrived_trains=5&arriving_trains=5&include_nonstopping=false`
      );
      return response.data;
    } catch (error) {
      const message = "Error deleting devices: " + error.message;
      toast.error(message);
      return rejectWithValue(error.message);
    }
  }
);
export const fetchLiveDepartureTrains = createAsyncThunk(
  "trains/fetchLiveDepartureTrains",
  async (stationShortCode, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://rata.digitraffic.fi/api/v1/live-trains/station/${stationShortCode}?departed_trains=5&departing_trains=5&include_nonstopping=false`
      );
      return response.data;
    } catch (error) {
      const message = "Error deleting devices: " + error.message;
      toast.error(message);
      return rejectWithValue(error.message);
    }
  }
);
export const fetchTrainDetailsByNumber = createAsyncThunk(
  "trains/fetchTrainDetailsByNumber",
  async (trainNumber, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://rata.digitraffic.fi/api/v1/trains/latest/${trainNumber}`
      );
      return response.data;
    } catch (error) {
      const message = "Error: " + error.message;
      toast.error(message);
      return rejectWithValue(error.message);
    }
  }
);
const trainSlice = createSlice({
  name: "trains",
  initialState: {
    trainLocations: [],
    liveTrains: [],
    liveArrivalTrains: [],
    liveDepartureTrains: [],
    trainDetailsByNumber: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrainLocations.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTrainLocations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.trainLocations = action.payload;
      })
      .addCase(fetchTrainLocations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchLiveTrains.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLiveTrains.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.liveTrains = action.payload;
      })
      .addCase(fetchLiveTrains.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchLiveArrivalTrains.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLiveArrivalTrains.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.liveArrivalTrains = action.payload;
      })
      .addCase(fetchLiveArrivalTrains.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchLiveDepartureTrains.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLiveDepartureTrains.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.liveDepartureTrains = action.payload;
      })
      .addCase(fetchLiveDepartureTrains.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchTrainDetailsByNumber.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTrainDetailsByNumber.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.trainDetailsByNumber = action.payload;
      })
      .addCase(fetchTrainDetailsByNumber.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default trainSlice.reducer;
