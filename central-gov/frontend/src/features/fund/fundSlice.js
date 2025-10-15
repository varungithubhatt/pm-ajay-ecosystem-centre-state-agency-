import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Set your backend base URL
axios.defaults.baseURL = "http://localhost:7000";

// Allocate Funds
export const allocateFunds = createAsyncThunk(
  "fund/allocateFunds",
  async (fundData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("/allocate", fundData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error allocating funds");
    }
  }
);

export const getFundAllocations = createAsyncThunk(
  "fund/getFundAllocations",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/allocations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data||response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error fetching fund allocations"
      );
    }
  }
)



const fundSlice = createSlice({
  name: "fund",
  initialState: {
    allocations: [],
    status: "idle",
    error: null,
    message: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(allocateFunds.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.message = null;
      })
      .addCase(allocateFunds.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.message = action.payload.message;
        state.allocations.push(action.payload.data);
      })
      .addCase(allocateFunds.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getFundAllocations.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getFundAllocations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allocations = action.payload || [];
        state.message = action.payload.message || "Fund allocations fetched successfully";
        state.error = null;
      })
      .addCase(getFundAllocations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch fund allocations";
      });
  },
});

export default fundSlice.reducer;
