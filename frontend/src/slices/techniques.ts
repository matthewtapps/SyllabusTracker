import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Technique, NewTechnique, UpdateTechnique } from "common";
import { RootState } from "../store/store";
import { fetchTechniques, postTechnique, updateTechnique, deleteTechnique } from "../util/Utilities";
import { updateDescriptions } from "./descriptions";
import { updateSuggestions } from "./suggestions";
import { updateTechniqueInCollectionTechniques } from "./collectionTechniques";


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
            throw new Error('No access token available');
        }
        return await fetchTechniques(token);
    }
);

export const postTechniqueAsync = createAsyncThunk(
    'techniques/postTechnique',
    async (technique: NewTechnique, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        const token = state.auth.accessToken;
        if (!token) {
            throw new Error('No access token available');
        }
        const postedTechnique = await postTechnique(technique, token);
        if (!postedTechnique) throw new Error(`Failed to post technique`)       
        thunkAPI.dispatch(updateDescriptions(postedTechnique))
        thunkAPI.dispatch(updateSuggestions(postedTechnique))
        thunkAPI.dispatch(updateTechniqueInCollectionTechniques(postedTechnique))
        return postedTechnique
    }
);

export const updateTechniqueAsync = createAsyncThunk(
    'techniques/updateTechnique',
    async (technique: UpdateTechnique, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        const token = state.auth.accessToken;
        if (!token) { throw new Error('No access token available'); }
        const updatedTechnique = await updateTechnique(technique, token);
        if (!updatedTechnique) throw new Error(`Failed to update technique`)
        thunkAPI.dispatch(updateDescriptions(updatedTechnique))
        thunkAPI.dispatch(updateSuggestions(updatedTechnique))
        thunkAPI.dispatch(updateTechniqueInCollectionTechniques(updatedTechnique))
        return updatedTechnique
    }
);

export const deleteTechniqueAsync = createAsyncThunk(
    'techniques/deleteTechnique',
    async (techniqueId: string, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        const token = state.auth.accessToken;
        if (!token) {
            throw new Error('No access token available');
        }
        const status = await deleteTechnique(techniqueId, token);
        if (status !== 200) {
            throw new Error('Technique failed to delete');
        }
        return techniqueId;
    }
);

const techniquesSlice = createSlice({
    name: 'techniques',
    initialState,
    reducers: {},
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
            })
            .addCase(postTechniqueAsync.fulfilled, (state, action) => {
                state.techniques.unshift(action.payload);
                updateDescriptions(action.payload)
            })
            .addCase(updateTechniqueAsync.fulfilled, (state, action) => {
                const index = state.techniques.findIndex(t => t.techniqueId === action.payload.techniqueId);
                if (index !== -1) {
                    state.techniques[index] = action.payload;
                }
            })
            .addCase(deleteTechniqueAsync.fulfilled, (state, action) => {
                state.techniques = state.techniques.filter(t => t.techniqueId !== action.payload);
            });
    },
});

export default techniquesSlice.reducer;
