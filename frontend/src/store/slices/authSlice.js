import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

const STORAGE_KEY = 'chatnova_user';

const getInitialUser = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const persistUser = (user) => {
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
};

export const getCurrentUser = createAsyncThunk('auth/getCurrentUser',async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/auth/current-user');
      const user = response.data.user;
      persistUser(user);
      return user;
    } catch (err) {
      persistUser(null);
      return rejectWithValue(err.response?.data?.message || 'Unauthorized User');
    }
  }
);

export const loginUser = createAsyncThunk('auth/loginUser', async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/auth/login', {
        email: email.trim(),
        password,
      });
      const { user, message } = response.data;
      persistUser(user);
      return { user, message };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Login failed. Please try again.');
    }
  }
);

export const registerUser = createAsyncThunk('auth/registerUser', async ({ fullName, email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/auth/register', {
        fullName,
        email: email.trim(),
        password,
      });
      const { user, message } = response.data;
      persistUser(user);
      return { user, message };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  try {
    await api.post('/api/auth/logout');
  } catch (err) {
    console.error('Logout error on server:', err);
  } finally {
    persistUser(null);
  }
  return null;
});

const handlePending = (state) => {
  state.isLoading = true;
  state.error = null;
};

const handleAuthFulfilled = (state, action) => {
  state.isLoading = false;
  state.user = action.payload.user;
  state.error = null;
};

const handleRejected = (state, action) => {
  state.isLoading = false;
  state.error = action.payload;
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: getInitialUser(),
    isInitialized: false,
    isLoading: false,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      persistUser(action.payload);
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    clearUser: (state) => {
      state.user = null;
      state.error = null;
      persistUser(null);
  },
  },
  extraReducers: (builder) => {
    builder
    .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.user = action.payload;
        state.error = null;
      })

      .addCase(getCurrentUser.rejected, (state) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.user = null;
        state.error = null;
        persistUser(null);
      })
      .addCase(loginUser.pending, handlePending)
      .addCase(loginUser.fulfilled, handleAuthFulfilled)
      .addCase(loginUser.rejected, handleRejected)
      .addCase(registerUser.pending, handlePending)
      .addCase(registerUser.fulfilled, handleAuthFulfilled)
      .addCase(registerUser.rejected, handleRejected)

      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isLoading = false;
        state.error = null;
        state.isInitialized = true;
      });
  },
});

export const { setUser, clearAuthError, clearUser } = authSlice.actions;
export default authSlice.reducer;