import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

export const getBids = createAsyncThunk("bids/get", async (gigId) => {
  const res = await api.get(`/bids/${gigId}`);
  return res.data;
});

export const createBid = createAsyncThunk("bids/create", async (data) => {
  await api.post("/bids", data);
});

export const hireBid = createAsyncThunk("bids/hire", async (id) => {
  await api.patch(`/bids/${id}/hire`);
});

const bidSlice = createSlice({
  name: "bids",
  initialState: { list: [] },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getBids.fulfilled, (state, action) => {
      state.list = action.payload;
    });
  }
});

export default bidSlice.reducer;
