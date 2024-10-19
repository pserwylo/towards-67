import { configureStore } from "@reduxjs/toolkit";
import { assetReducer } from "./assetSlice";

const store = configureStore({
  reducer: {
    assets: assetReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
