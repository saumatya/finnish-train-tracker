import { configureStore } from "@reduxjs/toolkit";
import trainReducer from "../reducers/trainSlice";
import stationReducer from "../reducers/stationSlice";

export const store = configureStore({
  reducer: { trains: trainReducer, stations: stationReducer },
});
