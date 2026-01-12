import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

export const login = createAsyncThunk("auth/login", async (data) => {
  const res = await api.post("/auth/login", data);
  return res.data.user;
});

export const registerUser = createAsyncThunk("auth/register", async (data) => {
  await api.post("/auth/register", data);
});

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.user = action.payload;
    });
  }
});

export default authSlice.reducer;
