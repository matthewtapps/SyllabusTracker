import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Collection, CollectionTechnique, NewCollection, UpdateCollection } from 'common';
import { RootState } from '../store/store';
import { deleteCollection, fetchCollections, postCollection, updateCollection } from '../util/Utilities';
import { updateDescriptions } from './descriptions';
import { updateSuggestions } from './suggestions';


interface CollectionsState {
    collections: Collection[];
    loading: boolean;
    lastUpdated: number | null;
    error: string | null;
};

const initialState: CollectionsState = {
    collections: [],
    loading: false,
    error: null,
    lastUpdated: null
};

export const fetchCollectionsAsync = createAsyncThunk(
    'collections/fetchCollections',
    async (_, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        const token = state.auth.accessToken;
        if (!token) {
            throw new Error('No access token available')
        }
        return await fetchCollections(token)
    }
);

export const postCollectionAsync = createAsyncThunk(
    'collections/postCollection',
    async (collection: NewCollection, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        const token = state.auth.accessToken;
        if (!token) {
            throw new Error('No access token available');
        }
        const postedCollection = await postCollection(collection, token);
        if (!postedCollection) {
            throw new Error('Collection failed to update')
        }
        thunkAPI.dispatch(updateDescriptions(postedCollection))
        thunkAPI.dispatch(updateSuggestions(postedCollection))
        return postedCollection;
    }
);

export const updateCollectionAsync = createAsyncThunk(
    'collections/updateCollection',
    async (collection: UpdateCollection, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        const token = state.auth.accessToken;
        if (!token) {
            throw new Error('No access token available');
        }
        const updatedCollection = await updateCollection(collection, token);
        if (!updatedCollection) {
            throw new Error('Collection failed to update')
        }      
        thunkAPI.dispatch(updateDescriptions(updatedCollection))
        thunkAPI.dispatch(updateSuggestions(updatedCollection))
        return updatedCollection;
    }
);

export const deleteCollectionAsync = createAsyncThunk(
    'collections/deleteCollection',
    async (collectionId: string, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        const token = state.auth.accessToken;
        if (!token) {
            throw new Error('No access token available');
        }
        const status = await deleteCollection(collectionId, token);
        if (status !== 200) {
            throw new Error('Collection failed to delete');
        }
        return collectionId;
    }
);

export const fetchCollectionsIfOld = createAsyncThunk(
    'collections/fetchCollectionsIfOld',
    async (_, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        const lastUpdated = state.collections.lastUpdated;

        if (lastUpdated) {
            const now = Date.now();
            const expiryTime = Number(process.env.REACT_APP_DATA_EXPIRY_MS || '300000'); // 5 minutes by default

            if (now - lastUpdated > expiryTime) {
                return thunkAPI.dispatch(fetchCollectionsAsync());
            }
        } else {
            return thunkAPI.dispatch(fetchCollectionsAsync());
        }
    }
);

const collectionsSlice = createSlice({
    name: 'collections',
    initialState,
    reducers: {
        updateTechniquesInCollection: (state, action: PayloadAction<{collectionId: string, collectionTechniques: CollectionTechnique[]}>) => {
            const { collectionId, collectionTechniques } = action.payload;
    
            state.collections = state.collections.map(collection => {
                if (collection.collectionId === collectionId) {
                    return {
                        ...collection,
                        collectionTechniques: collectionTechniques
                    };
                }
                return collection;
            });
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Collections
            .addCase(fetchCollectionsAsync.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(fetchCollectionsAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.collections = action.payload;
            })
            .addCase(fetchCollectionsAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch collections';
            })

            // Post new collection
            .addCase(postCollectionAsync.pending, (state) => {
                state.error = null;
            })
            .addCase(postCollectionAsync.fulfilled, (state, action) => {
                state.collections.unshift(action.payload)
            })
            .addCase(postCollectionAsync.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to post collection';
            })

            // Update a collection
            .addCase(updateCollectionAsync.pending, (state) => {
                state.error = null;
            })
            .addCase(updateCollectionAsync.fulfilled, (state, action) => {
                const index = state.collections.findIndex(collection => collection.collectionId === action.payload.collectionId);
                if (index !== -1) {
                    state.collections[index] = action.payload;
                }
            })
            .addCase(updateCollectionAsync.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to update collection';
            })

            // Delete a collection
            .addCase(deleteCollectionAsync.pending, (state) => {
                state.error = null;
            })
            .addCase(deleteCollectionAsync.fulfilled, (state, action) => {
                state.collections = state.collections.filter(collection => collection.collectionId !== action.payload);
            })
            .addCase(deleteCollectionAsync.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to delete collection';
            })

            // Fetch collections if old
            .addCase(fetchCollectionsIfOld.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCollectionsIfOld.fulfilled, (state) => {
                state.loading = false;
                // Update the lastUpdated timestamp
                state.lastUpdated = Date.now();
            })
            .addCase(fetchCollectionsIfOld.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to check if collections are old';
            });
    },
});

export const { updateTechniquesInCollection } = collectionsSlice.actions;
export default collectionsSlice.reducer;
