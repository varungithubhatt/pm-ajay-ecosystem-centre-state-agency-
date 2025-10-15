import {createSlice,createAsyncThunk} from "@reduxjs/toolkit"
import axios from "axios"

axios.defaults.baseURL = "http://localhost:7000";

export const getVillages = createAsyncThunk(
  "village/getVillages",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("/get-all-villages");
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error fetching villages");
    }
  }
);

export const getVillageById = createAsyncThunk(
    "village/getVillageById",
    async (id, thunkAPI) => {
            try{
                const  response = await axios.get(`/get-village/${id}`);
                return response.data.data;

            }catch(error){
                return thunkAPI.rejectWithValue(error.response?.data || "Error fetching village");
            }
    }
)


const villageSlice = createSlice({
  name: "village",
  initialState: {
    villages: [],
    selectedVillage: null,
    loading: false,
    error: null,
    
  },
  reducers: {
     clearSelectedVillage: (state) => {
      state.selectedVillage = null;
      state.error = null;
    },
   

  },
  extraReducers: (builder) => {
    builder
      .addCase(getVillages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getVillages.fulfilled, (state, action) => {
        state.loading = false;
        state.villages = action.payload;
      })
      .addCase(getVillages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

    
      .addCase(getVillageById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getVillageById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedVillage = action.payload;
      })
      .addCase(getVillageById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
      
  },
});
export const { clearSelectedVillage} = villageSlice.actions;
export default villageSlice.reducer;