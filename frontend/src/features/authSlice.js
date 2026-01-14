import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

// Load user from localStorage on initial state
const loadUserFromStorage = () => {
  try {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  } catch {
    return null;
  }
};

//  Role switching thunk
export const switchUserRole = createAsyncThunk(
  "auth/switchRole",
  async (role, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/roles/switch", { role });
      
      // Save updated user to localStorage
      localStorage.setItem('user', JSON.stringify(res.data.user));
      return res.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to switch role");
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/auth/login", data);
      // Save user to localStorage
      localStorage.setItem('user', JSON.stringify(res.data.user));
      return res.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Login failed");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/auth/register", data);
      // Save user to localStorage
      localStorage.setItem('user', JSON.stringify(res.data.user));
      return res.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Registration failed");
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      // Call logout API
      await api.post("/api/auth/logout");
      
      // Clear ALL storage
      localStorage.removeItem('user');
      sessionStorage.clear();
      
      // Clear cookies
      document.cookie.split(";").forEach(function(c) {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      
      return null;
    } catch (error) {
      // Even if API fails, clear storage
      localStorage.removeItem('user');
      sessionStorage.clear();
      return rejectWithValue(error.response?.data?.error || "Logout failed");
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  "auth/me",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/auth/me");
      // Save user to localStorage
      localStorage.setItem('user', JSON.stringify(res.data.user));
      return res.data.user;
    } catch (error) {
      // If 401, clear localStorage
      if (error.response?.status === 401) {
        localStorage.removeItem('user');
      }
      return rejectWithValue(null);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: { 
    user: loadUserFromStorage(),
    loading: false,
    error: null,
    isAuthenticated: false,
    isInitialized: false
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    manualLogout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user');
      sessionStorage.clear();
    },
    // Manual role update (for quick testing)
    updateUserRole: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Role Switching 
      .addCase(switchUserRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(switchUserRole.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(switchUserRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isInitialized = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isInitialized = true;
      })
      
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isInitialized = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isInitialized = true;
      })
      
      // Logout
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.isInitialized = true;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.isInitialized = true;
        state.error = action.payload;
      })
      
      // Get Current User
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
        state.isInitialized = true;
        state.error = null;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.isInitialized = true;
      });
  }
});


export const { clearError, manualLogout, updateUserRole } = authSlice.actions;
export default authSlice.reducer;