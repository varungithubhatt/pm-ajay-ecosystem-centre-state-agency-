import axios from "axios";
import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";


export const generateReport=createAsyncThunk(
     "reports/generateReport",
  async (reportType, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "/report/generate",
        { reportType },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

  const fileUrl = `http://localhost:7000/${response.data.filePath}`;
      window.open(fileUrl, "_blank"); // Opens generated file in a new tab

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


const reportSlice = createSlice({
  name: "report",
  initialState: {
    loading: false,
    data: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(generateReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateReport.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(generateReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default reportSlice.reducer;