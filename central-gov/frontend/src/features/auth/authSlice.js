import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Set your backend base URL
axios.defaults.baseURL = "http://localhost:7000";

// Login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/login", { email, password });
       localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      return response.data; // { token }
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Register
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ name, email, password, role, designation }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/register", { name, email, password, role, designation });
      return response.data; // { message: "user registered successfully" }
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    user: JSON.parse(localStorage.getItem("user")) || null,
    status: "idle",
    error: null,
    message: null,
    loggedIn: false,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.loggedIn = false;
     localStorage.removeItem("token");
     localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => { state.status = "loading"; state.error = null;
        state.message = "Authenticating...";
       })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
          state.user = action.payload.user; 
        state.loggedIn = true;
        state.token = action.payload.token;
         localStorage.setItem("token", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.loggedIn = false;
        state.error = action.payload?.message || "Login failed";
      })
      // Register
      .addCase(registerUser.pending, (state) => { state.status = "loading"; state.error = null;
        state.message = "Registering user...";
       })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loggedIn = false;
        state.message = action.payload.message;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.loggedIn = false;
        state.error = action.payload?.message || "Registration failed";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;



