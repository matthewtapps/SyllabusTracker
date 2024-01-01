import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store/store";
import { fetchTechniques } from "../util/Utilities";
import { Technique } from "common";



interface TechniquesState {
    techniques: Technique[];
    loading: boolean;
    error: string | null;
}

const initialState: TechniquesState = {
    techniques: [],
    loading: false,
    error: null,
};

export const fetchTechniquesAsync = createAsyncThunk(
    'techniques/fetchTechniques',
    async (_, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        const token = state.auth.accessToken;
        if (!token) {
            throw new Error('No access token available')
        }
        return await fetchTechniques(token)
    }
);

const techniquesSlice = createSlice({
    name: 'techniques',
    initialState,
    reducers: {
      // Define reducers for other actions like add, update, delete...
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchTechniquesAsync.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchTechniquesAsync.fulfilled, (state, action) => {
          state.loading = false;
          state.techniques = action.payload;
        })
        .addCase(fetchTechniquesAsync.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message || 'Failed to fetch techniques';
        });
    },
  });
  
  export default techniquesSlice.reducer;
