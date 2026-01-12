import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

export const getBids = createAsyncThunk(
  "bids/get",
  async (gigId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/bids/gig/${gigId}`); // Fixed endpoint
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch bids");
    }
  }
);

export const createBid = createAsyncThunk(
  "bids/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/bids", data); // Add /api/
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to create bid");
    }
  }
);

export const hireBid = createAsyncThunk(
  "bids/hire",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/api/bids/${id}/hire`); // Add /api/
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to hire freelancer");
    }
  }
);

// Add get user's bids
export const getMyBids = createAsyncThunk(
  "bids/myBids",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/bids/my-bids"); // Add /api/
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch your bids");
    }
  }
);

const bidSlice = createSlice({
  name: "bids",
  initialState: { 
    list: [],
    myBids: [],
    loading: false,
    error: null 
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearBids: (state) => {
      state.list = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Get bids for a gig
      .addCase(getBids.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBids.fulfilled, (state, action) => {
        state.loading = false;
        state.list = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getBids.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create bid
      .addCase(createBid.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBid.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createBid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Hire bid
      .addCase(hireBid.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(hireBid.fulfilled, (state, action) => {
        state.loading = false;
        // Update the bid status in the list
        const hiredBid = action.payload.bid;
        state.list = state.list.map(bid => 
          bid._id === hiredBid._id ? hiredBid : bid
        );
      })
      .addCase(hireBid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get my bids
      .addCase(getMyBids.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyBids.fulfilled, (state, action) => {
        state.loading = false;
        state.myBids = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getMyBids.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearBids } = bidSlice.actions;
export default bidSlice.reducer;