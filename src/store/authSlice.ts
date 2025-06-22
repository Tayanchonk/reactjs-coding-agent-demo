import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { AuthState, LoginCredentials, TwoFactorVerification } from '../types';
import { AuthApiService } from '../services/authApi';

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loginStep: 'credentials',
  isLoading: false,
  error: null,
};

// Async thunks
export const validateCredentials = createAsyncThunk(
  'auth/validateCredentials',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await AuthApiService.validateCredentials(credentials);
      if (response.error) {
        return rejectWithValue(response.error);
      }
      return response;
    } catch {
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const verifyTwoFactor = createAsyncThunk(
  'auth/verifyTwoFactor',
  async (verification: TwoFactorVerification, { rejectWithValue }) => {
    try {
      const response = await AuthApiService.verifyTwoFactor(verification);
      if (response.error) {
        return rejectWithValue(response.error);
      }
      return response;
    } catch {
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await AuthApiService.logout();
      if (response.error) {
        return rejectWithValue(response.error);
      }
      return response;
    } catch {
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetLoginStep: (state) => {
      state.loginStep = 'credentials';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Validate credentials
      .addCase(validateCredentials.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(validateCredentials.fulfilled, (state) => {
        state.isLoading = false;
        state.loginStep = 'twoFactor';
        state.error = null;
      })
      .addCase(validateCredentials.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Verify two-factor
      .addCase(verifyTwoFactor.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyTwoFactor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.data;
        state.loginStep = 'completed';
        state.error = null;
      })
      .addCase(verifyTwoFactor.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Logout
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.loginStep = 'credentials';
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, resetLoginStep } = authSlice.actions;
export default authSlice.reducer;