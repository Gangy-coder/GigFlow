import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import gigReducer from "../features/gigSlice";
import bidReducer from "../features/bidSlice";

export const store = configureStore({
  reducer: { auth: authReducer, gigs: gigReducer, bids: bidReducer }
});
