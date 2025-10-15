// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// axios.defaults.baseURL = "http://localhost:7000";

// // Async thunk to allocate fund for a village by ID
// export const allocateFund = createAsyncThunk(
//   "village/allocateFund",
//   async ({ id, amount }, thunkAPI) => {
//     try {
//       const response = await axios.post(`/allocate-fund/${id}`, { amount });
//       return response.data.data;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.response?.data?.message || "Error allocating fund");
//     }
//   }
// );

// export const getFundAllocationsVillages = createAsyncThunk(
//   "village/getFundAllocationsVillages",
//   async (_, thunkAPI) => {
//     try {
//       const response = await axios.get("/get-fund-allocations-villages");
//       return response.data;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.response?.data || "Error fetching fund allocations");
//     }
//   }
// );


// const fundvillageSlice = createSlice({
//   name: "fundvillage",
//   initialState: {
//     villages: [],
 
//     selectedVillage: null,
//     loading: false,
//     error: null,
//     fundLoading: false,
//     fundSuccess: false,
//     fundError: null,
//   },
//   reducers: {
//     clearFundStatus: (state) => {
//       state.fundLoading = false;
//       state.fundSuccess = false;
//       state.fundError = null;
//     },
//   },
//   extraReducers: (builder) => {
//     // Fund allocation
//     builder
//       .addCase(allocateFund.pending, (state) => {
//         state.fundLoading = true;
//         state.fundSuccess = false;
//         state.fundError = null;
//       })
//       .addCase(allocateFund.fulfilled, (state, action) => {
//         state.fundLoading = false;
//         state.fundSuccess = true;
//         // Update selectedVillage fundAllocations if needed
//         if (state.selectedVillage) {
//           state.selectedVillage.fundAllocations = action.payload.village.fundAllocations;
//         }
//       })
//       .addCase(allocateFund.rejected, (state, action) => {
//         state.fundLoading = false;
//         state.fundError = action.payload;
//       })
//       // Fund allocations for villages
//       .addCase(getFundAllocationsVillages.pending, (state) => {
//         state.loading = true;
//         state.error = null;

//       })
//       .addCase(getFundAllocationsVillages.fulfilled, (state, action) => {
//         state.loading = false;
     
//         state.villages=action.payload;
//       })
//       .addCase(getFundAllocationsVillages.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const { clearFundStatus } = fundvillageSlice.actions;
// export default fundvillageSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:7000";

// Allocate fund for a village by ID
export const allocateFund = createAsyncThunk(
  "fundvillage/allocateFund",
  async ({ id, amount }, thunkAPI) => {
    try {
      const response = await axios.post(`/allocate-fund/${id}`, { amount });
      return response.data.data; // make sure backend returns updated fund allocations
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Error allocating fund");
    }
  }
);

// Get all fund allocations across villages
export const getFundAllocationsVillages = createAsyncThunk(
  "fundvillage/getFundAllocationsVillages",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("/get-fund-allocations-villages");
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error fetching fund allocations");
    }
  }
);

const fundvillageSlice = createSlice({
  name: "fundvillage",
  initialState: {
    fundAllocations: [], // <-- unified state array for allocations
    selectedVillage: null,
    loading: false,
    error: null,
    fundLoading: false,
    fundSuccess: false,
    fundError: null,
  },
  reducers: {
    clearFundStatus: (state) => {
      state.fundLoading = false;
      state.fundSuccess = false;
      state.fundError = null;
    },
  },
  extraReducers: (builder) => {
    // Allocate fund
    builder
      .addCase(allocateFund.pending, (state) => {
        state.fundLoading = true;
        state.fundSuccess = false;
        state.fundError = null;
      })
      .addCase(allocateFund.fulfilled, (state, action) => {
        state.fundLoading = false;
        state.fundSuccess = true;

        // Optional: add new allocation to fundAllocations array
        if (action.payload) {
          state.fundAllocations.push(action.payload);
        }
      })
      .addCase(allocateFund.rejected, (state, action) => {
        state.fundLoading = false;
        state.fundError = action.payload;
      })

      // Get all fund allocations
      .addCase(getFundAllocationsVillages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFundAllocationsVillages.fulfilled, (state, action) => {
        state.loading = false;
        state.fundAllocations = action.payload;
      })
      .addCase(getFundAllocationsVillages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearFundStatus } = fundvillageSlice.actions;
export default fundvillageSlice.reducer;
