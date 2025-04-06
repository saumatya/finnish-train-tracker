import { configureStore } from "@reduxjs/toolkit";
import trainReducer from "../reducers/trainSlice";

export const store = configureStore({
  reducer: { trains: trainReducer },
});
