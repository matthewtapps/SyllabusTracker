import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchCollections, fetchTechniques, getOpenGuards, getPositions, getTypes } from '../util/Utilities';
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
    techniqueSuggestions: SuggestionsObject
    collectionSuggestions: SuggestionsObject
    loading: boolean,
    error: string | null
};

const initialState: SuggestionsState = {
    techniqueSuggestions: initialSuggestions,
    collectionSuggestions: initialSuggestions,
    loading: false,
    error: null
}

export const fetchTechniqueSuggestionsAsync = createAsyncThunk(
    'suggestions/fetchTechniqueSuggestionsAsync',
    async (_, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        const token = state.auth.accessToken;
        if (!token) {
            throw new Error('No access token available')
        }

        const positions = await getPositions(token)
        const types = await getTypes(token)
        const openguards = await getOpenGuards(token)
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
        const positions = await getPositions(token)
        const types = await getTypes(token)
        const openguards = await getOpenGuards(token)
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

const suggestionsSlice = createSlice({
    name: 'suggestions',
    initialState,
    reducers: {
        updateSuggestions: (state, action: PayloadAction<Technique | Collection>) => {
            const item = action.payload;

            // Check if item is an instance of Technique or Collection
            if ('techniqueId' in item  && !state.techniqueSuggestions.titleOptions.includes(item.title)) {
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
                state.error = null;
                state.loading = true;
            })
            .addCase(fetchTechniqueSuggestionsAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.techniqueSuggestions = {...action.payload};
            })
            .addCase(fetchTechniqueSuggestionsAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch technique suggestions';
            })

            // Collection suggestions
            .addCase(fetchCollectionSuggestionsAsync.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(fetchCollectionSuggestionsAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.collectionSuggestions = action.payload;
            })
            .addCase(fetchCollectionSuggestionsAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch collection suggestions';
            })
    },
});

export const { updateSuggestions } = suggestionsSlice.actions;
export default suggestionsSlice.reducer;
