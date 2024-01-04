import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { NewTechnique, Technique, UpdateTechnique } from "common";
import { RootState } from "../store/store";
import { deleteTechnique, fetchTechniques, postTechnique, updateTechnique } from "../util/Utilities";
import { updateTechniqueInCollectionTechniques } from "./collectionTechniques";
import { updateDescriptions } from "./descriptions";
import { updateSuggestions } from "./suggestions";


interface TechniquesState {
    techniques: Technique[];
    techniquesLoading: boolean;
    postingTechnique: boolean;
    updatingTechnique: boolean;
    deletingTechnique: boolean;
    checkingAge: boolean;
    error: string | null;
}

const initialState: TechniquesState = {
    techniques: [],
    techniquesLoading: false,
    postingTechnique: false,
    updatingTechnique: false,
    deletingTechnique: false,
    checkingAge: false,
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

export const fetchTechniquesIfOld = createAsyncThunk(
    'techniques/fetchTechniquesIfOld',
    async (_, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        const techniques = state.techniques.techniques

        if (techniques.length > 0) {
            const now = Date.now();
            const expiryTime = Number(process.env.REACT_APP_DATA_EXPIRY_MS || '300000');

            const mostRecentTechnique = techniques.reduce((latest, technique) => {
                return (latest.lastUpdated.getTime() > technique.lastUpdated.getTime()) ? latest : technique;
            }, techniques[0]);

            const lastUpdated = mostRecentTechnique.lastUpdated.getTime();
            if (now - lastUpdated > expiryTime) {
                return thunkAPI.dispatch(fetchTechniquesAsync());
            }
        } else {
            return thunkAPI.dispatch(fetchTechniquesAsync());
        }
    }
);

const techniquesSlice = createSlice({
    name: 'techniques',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetching techniques 
            .addCase(fetchTechniquesAsync.pending, (state) => {
                state.techniquesLoading = true;
            })
            .addCase(fetchTechniquesAsync.fulfilled, (state, action) => {
                state.techniquesLoading = false;
                state.techniques = action.payload;
            })
            .addCase(fetchTechniquesAsync.rejected, (state, action) => {
                state.techniquesLoading = false;
                state.error = action.error.message || 'Failed to fetch techniques';
            })

            // Posting technique
            .addCase(postTechniqueAsync.pending, (state) => {
                state.postingTechnique = true;
            })
            .addCase(postTechniqueAsync.fulfilled, (state, action) => {
                state.techniques.unshift(action.payload);
                state.postingTechnique = false;
                updateDescriptions(action.payload)
            })
            .addCase(postTechniqueAsync.rejected, (state, action) => {
                state.postingTechnique = false;
                state.error = action.error.message || "Failed to post technique"
            })

            // Updating technique
            .addCase(updateTechniqueAsync.pending, (state) => {
                state.updatingTechnique = true;
            })
            .addCase(updateTechniqueAsync.fulfilled, (state, action) => {
                const index = state.techniques.findIndex(t => t.techniqueId === action.payload.techniqueId);
                if (index !== -1) {
                    state.techniques[index] = action.payload;
                }
                updateDescriptions(action.payload)
                updateSuggestions(action.payload)
                updateTechniqueInCollectionTechniques(action.payload)
            })
            .addCase(updateTechniqueAsync.rejected, (state, action) => {
                state.updatingTechnique = false;
                state.error = action.error.message || "Failed to update technique"
            })

            // Deleting technique
            .addCase(deleteTechniqueAsync.pending, (state) => {
                state.deletingTechnique = true;
            })
            .addCase(deleteTechniqueAsync.fulfilled, (state, action) => {
                state.techniques = state.techniques.filter(t => t.techniqueId !== action.payload);
            })
            .addCase(deleteTechniqueAsync.rejected, (state, action) => {
                state.deletingTechnique = false;
                state.error = action.error.message || "Failed to delete technique"
            })
            
            // Checking age of techniques
            .addCase(fetchTechniquesIfOld.pending, (state) => {
                state.checkingAge = true;
            })
            .addCase(fetchTechniquesIfOld.fulfilled, (state) => {
                state.checkingAge = false;
            })
            .addCase(fetchTechniquesIfOld.rejected, (state, action) => {
                state.checkingAge = false;
                state.error = action.error.message || "Failed checking age"
            })
    },
});

export default techniquesSlice.reducer;
