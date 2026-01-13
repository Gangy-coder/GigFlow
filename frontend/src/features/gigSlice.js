import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

export const getGigs = createAsyncThunk(
  "gigs/get",
  async (query = "", { rejectWithValue }) => {
    try {
    
      const res = await api.get(`/api/gigs?search=${query}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch gigs");
    }
  }
);

export const createGig = createAsyncThunk(
  "gigs/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/gigs", data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to create gig");
    }
  }
);

const gigSlice = createSlice({
  name: "gigs",
  initialState: { 
    list: [],
    loading: false,
    error: null 
  },
  reducers: {
    // Optional: Add a clear error reducer
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // getGigs
    builder
      .addCase(getGigs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGigs.fulfilled, (state, action) => {
        state.loading = false;
        // Ensure payload is array
        state.list = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getGigs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load gigs";
      })
      
      // createGig
      .addCase(createGig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGig.fulfilled, (state, action) => {
        state.loading = false;
        // Add new gig to the list
        state.list.unshift(action.payload);
      })
      .addCase(createGig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create gig";
      });
  }
});

export const { clearError } = gigSlice.actions;
export default gigSlice.reducer;