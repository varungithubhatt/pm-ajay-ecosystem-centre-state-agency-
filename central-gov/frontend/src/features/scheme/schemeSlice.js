import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


// Set your backend base URL
axios.defaults.baseURL = "http://localhost:7000";

 
  export const createScheme = createAsyncThunk(
  "scheme/createScheme",
  async (schemeData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("/create_schemes", schemeData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error creating scheme");
    }
  }
);

export const getAllSchemes = createAsyncThunk(
  "scheme/getAllSchemes",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/get_all_schemes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error fetching schemes"
      );
    }
  }
);

const schemeSlice = createSlice({
  name: "scheme",
  initialState: {
    schemes: [],
    status: "idle",
    error: null,
    message: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createScheme.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.message = null;
      })
      .addCase(createScheme.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.message = action.payload.message;
        state.schemes.push(action.payload.data);
      })
      .addCase(createScheme.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getAllSchemes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllSchemes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.schemes = action.payload || [];
        state.message = action.payload.message || "Schemes fetched successfully";
        state.error = null;
      })
      .addCase(getAllSchemes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch schemes";
      });
  },
});

export default schemeSlice.reducer;