import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CollectionTechnique, Technique } from "common";
import { RootState } from "../store/store";
import { fetchCollectionTechniques, postCollectionTechniques } from "../util/Utilities";
import { updateTechniquesInCollection } from "./collections";


interface CollectionTechniquesState {
    collectionTechniques: CollectionTechnique[];
    loading: boolean;
    error: string | null;
    lastUpdated: number | null;
}

const initialState: CollectionTechniquesState = {
    collectionTechniques: [],
    loading: false,
    error: null,
    lastUpdated: null,
};

interface CollectionTechniqueDTO { 
    index: number; 
    technique: Technique; 
}

export const fetchCollectionTechniquesAsync = createAsyncThunk(
    'collectionTechniques/fetchCollectionTechniques',
    async (_, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        const token = state.auth.accessToken;
        if (!token) {
            throw new Error('No access token available');
        }
        return await fetchCollectionTechniques(token);
    }
);

export const postCollectionTechniquesAsync = createAsyncThunk(
    'collectionTechniques/postCollectionTechniques',
    async (data: {collectionId: string, collectionTechniques: CollectionTechniqueDTO[]}, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        const token = state.auth.accessToken;
        if (!token) {
            throw new Error('No access token available');
        }
        const updatedCollectionTechniques = await postCollectionTechniques(data.collectionId, data.collectionTechniques, token);
        thunkAPI.dispatch(updateTechniquesInCollection({collectionId: data.collectionId, collectionTechniques: updatedCollectionTechniques}))
        return { collectionId: data.collectionId, collectionTechniques: updatedCollectionTechniques };
    }
);

export const fetchCollectionTechniquesIfOld = createAsyncThunk(
    'collectionTechniques/fetchCollectionTechniquesIfOld',
    async (_, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        const lastUpdated = state.collectionTechniques.lastUpdated;

        if (lastUpdated) {
            const now = Date.now();
            const expiryTime = Number(process.env.REACT_APP_DATA_EXPIRY_MS || '300000'); // 5 minutes by default

            if (now - lastUpdated > expiryTime) {
                return thunkAPI.dispatch(fetchCollectionTechniquesAsync());
            }
        } else {
            return thunkAPI.dispatch(fetchCollectionTechniquesAsync());
        }
    }
);

const collectionTechniquesSlice = createSlice({
    name: 'collectionTechniques',
    initialState,
    reducers: {
        updateTechniqueInCollectionTechniques: (state, action: PayloadAction<Technique>) => {
            const updatedTechnique = action.payload;
            state.collectionTechniques = state.collectionTechniques.map(ct => {
                if (ct.technique.techniqueId === updatedTechnique.techniqueId) {
                    return { ...ct, technique: updatedTechnique };
                }
                return ct;
            });
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch collection techniques
            .addCase(fetchCollectionTechniquesAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCollectionTechniquesAsync.fulfilled, (state, action) => {
                state.collectionTechniques = action.payload;
                state.loading = false;
            })
            .addCase(fetchCollectionTechniquesAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch collection techniques';
            })
            // Post collection techniques
            .addCase(postCollectionTechniquesAsync.pending, (state) => {
                state.error = null;
            })
            .addCase(postCollectionTechniquesAsync.fulfilled, (state, action) => {
                const { collectionId, collectionTechniques } = action.payload;
                const updatedCollectionTechniques = state.collectionTechniques.filter(ct => 
                    ct.collection.collectionId !== collectionId
                );
                state.collectionTechniques = updatedCollectionTechniques.concat(collectionTechniques);
                state.lastUpdated = Date.now()
            })
            .addCase(postCollectionTechniquesAsync.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to post collection techniques';
            })
    },
});

export const { updateTechniqueInCollectionTechniques } = collectionTechniquesSlice.actions;
export default collectionTechniquesSlice.reducer;
