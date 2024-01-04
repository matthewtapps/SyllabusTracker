import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchCollections, fetchTechniques, fetchOpenGuards, fetchPositions, fetchTypes } from '../util/Utilities';
import { RootState } from '../store/store';
import { Technique, Collection } from 'common';


interface SuggestionsObject {
    titleOptions: string[],
    positionOptions: string[],
    hierarchyOptions: string[],
    typeOptions: string[],
    openGuardOptions: string[],
    giOptions: string[]
}

const initialSuggestions: SuggestionsObject = {
    titleOptions: [],
    positionOptions: [],
    hierarchyOptions: ["Top", "Bottom"],
    typeOptions: [],
    openGuardOptions: [],
    giOptions: ["Yes Gi", "No Gi", "Both"],
}

interface SuggestionsState {
    techniqueSuggestions: SuggestionsObject;
    collectionSuggestions: SuggestionsObject;
    techniqueSuggestionsLoading: boolean;
    collectionSuggestionsLoading: boolean;
    techniqueSuggestionsLastUpdated: number | null;
    collectionSuggestionsLastUpdated: number | null;
    checkingTechniqueSuggestionsAge: boolean;
    checkingCollectionSuggestionsAge: boolean;
    suggestionsError: string | null;
};

const initialState: SuggestionsState = {
    techniqueSuggestions: initialSuggestions,
    collectionSuggestions: initialSuggestions,
    techniqueSuggestionsLastUpdated: null,
    collectionSuggestionsLastUpdated: null,
    techniqueSuggestionsLoading: false,
    collectionSuggestionsLoading: false,
    checkingTechniqueSuggestionsAge: false,
    checkingCollectionSuggestionsAge: false,
    suggestionsError: null
}

export const fetchTechniqueSuggestionsAsync = createAsyncThunk(
    'suggestions/fetchTechniqueSuggestionsAsync',
    async (_, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        const token = state.auth.accessToken;
        if (!token) {
            throw new Error('No access token available')
        }

        const positions = await fetchPositions(token)
        const types = await fetchTypes(token)
        const openguards = await fetchOpenGuards(token)
        const techniques = await fetchTechniques(token)

        let suggestions: SuggestionsObject = {
            titleOptions: [],
            positionOptions: [],
            hierarchyOptions: ["Top", "Bottom"],
            typeOptions: [],
            openGuardOptions: [],
            giOptions: ["Yes Gi", "No Gi", "Both"],
        }

        positions.forEach(position => {
            if (!suggestions.positionOptions.includes(position.title)) { suggestions.positionOptions.push(position.title) }
        })
        types.forEach(type => {
            if (!suggestions.typeOptions.includes(type.title)) { suggestions.typeOptions.push(type.title) }
        })
        openguards.forEach(openguard => {
            if (!suggestions.openGuardOptions.includes(openguard.title)) { suggestions.openGuardOptions.push(openguard.title) }
        })
        techniques.forEach(technique => {
            if (!suggestions.titleOptions.includes(technique.title)) { suggestions.titleOptions.push(technique.title) }
        })

        return suggestions
    }
);

export const fetchCollectionSuggestionsAsync = createAsyncThunk(
    'suggestions/fetchCollectionSuggestionsAsync',
    async (_, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        const token = state.auth.accessToken;
        if (!token) {
            throw new Error('No access token available')
        }
        const positions = await fetchPositions(token)
        const types = await fetchTypes(token)
        const openguards = await fetchOpenGuards(token)
        const collections = await fetchCollections(token)

        let suggestions: SuggestionsObject = {
            titleOptions: [],
            positionOptions: [],
            hierarchyOptions: ["Top", "Bottom"],
            typeOptions: [],
            openGuardOptions: [],
            giOptions: ["Yes Gi", "No Gi", "Both"],
        }

        positions.forEach(position => {
            if (!suggestions.positionOptions.includes(position.title)) { suggestions.positionOptions.push(position.title) }
        })
        types.forEach(type => {
            if (!suggestions.typeOptions.includes(type.title)) { suggestions.typeOptions.push(type.title) }
        })
        openguards.forEach(openguard => {
            if (!suggestions.openGuardOptions.includes(openguard.title)) { suggestions.openGuardOptions.push(openguard.title) }
        })
        collections.forEach(collection => {
            if (!suggestions.titleOptions.includes(collection.title)) { suggestions.titleOptions.push(collection.title) }
        })

        return suggestions
    }
);

export const fetchTechniqueSuggestionsIfOld = createAsyncThunk(
    'suggestions/fetchTechniqueSuggestionsIfOld',
    async (_, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        const lastUpdated = state.suggestions.techniqueSuggestionsLastUpdated;

        if (lastUpdated) {
            const now = Date.now();
            const expiryTime = Number(process.env.REACT_APP_DATA_EXPIRY_MS || '300000'); // 5 minutes by default

            if (now - lastUpdated > expiryTime) {
                thunkAPI.dispatch(fetchTechniqueSuggestionsAsync());
            }
        } else {
            thunkAPI.dispatch(fetchTechniqueSuggestionsAsync());
        }
    }
);

export const fetchCollectionSuggestionsIfOld = createAsyncThunk(
    'suggestions/fetchCollectionSuggestionsIfOld',
    async (_, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        const lastUpdated = state.suggestions.collectionSuggestionsLastUpdated;

        if (lastUpdated) {
            const now = Date.now();
            const expiryTime = Number(process.env.REACT_APP_DATA_EXPIRY_MS || '300000'); // 5 minutes by default

            if (now - lastUpdated > expiryTime) {
                thunkAPI.dispatch(fetchCollectionSuggestionsAsync());
            }
        } else {
            thunkAPI.dispatch(fetchCollectionSuggestionsAsync());
        }
    }
);

const suggestionsSlice = createSlice({
    name: 'suggestions',
    initialState,
    reducers: {
        updateSuggestions: (state, action: PayloadAction<Technique | Collection>) => {
            const item = action.payload;

            // Check if item is an instance of Technique or Collection
            if ('techniqueId' in item && !state.techniqueSuggestions.titleOptions.includes(item.title)) {
                state.techniqueSuggestions.titleOptions.push(item.title);
            }
            if ('collectionId' in item && !state.collectionSuggestions.titleOptions.includes(item.title)) {
                state.collectionSuggestions.titleOptions.push(item.title);
            }

            // Update position, type, and open guard suggestions for both techniques and collections
            if (item.position && !state.techniqueSuggestions.positionOptions.includes(item.position.title)) {
                state.techniqueSuggestions.positionOptions.push(item.position.title);
                state.collectionSuggestions.positionOptions.push(item.position.title);
            }
            if (item.type && !state.techniqueSuggestions.typeOptions.includes(item.type.title)) {
                state.techniqueSuggestions.typeOptions.push(item.type.title);
                state.collectionSuggestions.typeOptions.push(item.type.title);
            }
            if (item.openGuard && !state.techniqueSuggestions.openGuardOptions.includes(item.openGuard.title)) {
                state.techniqueSuggestions.openGuardOptions.push(item.openGuard.title);
                state.collectionSuggestions.openGuardOptions.push(item.openGuard.title);
            }
        }
    },
    extraReducers: (builder) => {
        builder
            // Technique Suggestions
            .addCase(fetchTechniqueSuggestionsAsync.pending, (state) => {
                state.suggestionsError = null;
                state.techniqueSuggestionsLoading = true;
            })
            .addCase(fetchTechniqueSuggestionsAsync.fulfilled, (state, action) => {
                state.techniqueSuggestionsLoading = false;
                state.techniqueSuggestions = { ...action.payload };
            })
            .addCase(fetchTechniqueSuggestionsAsync.rejected, (state, action) => {
                state.techniqueSuggestionsLoading = false;
                state.suggestionsError = action.error.message || 'Failed to fetch technique suggestions';
            })

            // Collection suggestions
            .addCase(fetchCollectionSuggestionsAsync.pending, (state) => {
                state.suggestionsError = null;
                state.collectionSuggestionsLoading = true;
            })
            .addCase(fetchCollectionSuggestionsAsync.fulfilled, (state, action) => {
                state.collectionSuggestionsLoading = false;
                state.collectionSuggestions = action.payload;
            })
            .addCase(fetchCollectionSuggestionsAsync.rejected, (state, action) => {
                state.collectionSuggestionsLoading = false;
                state.suggestionsError = action.error.message || 'Failed to fetch collection suggestions';
            })

            // Fetch technique suggestions if old
            .addCase(fetchTechniqueSuggestionsIfOld.pending, (state) => {
                state.checkingTechniqueSuggestionsAge = true;
            })
            .addCase(fetchTechniqueSuggestionsIfOld.fulfilled, (state) => {
                state.checkingTechniqueSuggestionsAge = false;
                state.techniqueSuggestionsLastUpdated = Date.now();
            })
            .addCase(fetchTechniqueSuggestionsIfOld.rejected, (state, action) => {
                state.checkingTechniqueSuggestionsAge = false;
                state.suggestionsError = action.error.message || 'Failed to check if technique suggestions are old';
            })
            
            // Fetch collection suggestions if old
            .addCase(fetchCollectionSuggestionsIfOld.pending, (state) => {
                state.checkingCollectionSuggestionsAge = true;
            })
            .addCase(fetchCollectionSuggestionsIfOld.fulfilled, (state) => {
                state.checkingCollectionSuggestionsAge = false;
                state.collectionSuggestionsLastUpdated = Date.now();
            })
            .addCase(fetchCollectionSuggestionsIfOld.rejected, (state, action) => {
                state.checkingCollectionSuggestionsAge = false;
                state.suggestionsError = action.error.message || 'Failed to check if collection suggestions are old';
            });
    },
});

export const { updateSuggestions } = suggestionsSlice.actions;
export default suggestionsSlice.reducer;
