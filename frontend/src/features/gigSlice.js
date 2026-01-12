import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

export const getGigs = createAsyncThunk("gigs/get", async (query = "") => {
  const res = await api.get(`/gigs?q=${query}`);
  return res.data;
});

export const createGig = createAsyncThunk("gigs/create", async (data) => {
  const res = await api.post("/gigs", data);
  return res.data;
});

const gigSlice = createSlice({
  name: "gigs",
  initialState: { list: [] },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getGigs.fulfilled, (state, action) => {
      state.list = action.payload;
    });
  }
});

export default gigSlice.reducer;
