import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Collection, Technique } from 'common';
import { RootState } from '../store/store';
import { fetchOpenGuards, fetchPositions, fetchTypes } from '../util/Utilities';


interface DescriptionMap {
    [key: string]: string | undefined;
}

interface Descriptions {
    [key: string]: DescriptionMap
};

interface DescriptionsState {
    descriptions: Descriptions
    loading: boolean;
    error: string | null;
    lastUpdated: number | null;
}

const initialState: DescriptionsState = {
    descriptions: {
        position: {},
        type: {},
        openGuard: {}
    },
    loading: false,
    error: null,
    lastUpdated: null
}

export const fetchDescriptionsAsync = createAsyncThunk(
    'descriptions/fetchDescriptionsAsync',
    async (_, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        const token = state.auth.accessToken;
        if (!token) {
            throw new Error('No access token available');
        }

        const positions = await fetchPositions(token);
        const types = await fetchTypes(token);
        const openguards = await fetchOpenGuards(token);

        let descriptions: Descriptions = {
            position: {},
            type: {},
            openGuard: {}
        };

        positions.forEach(position => {
            descriptions.position[position.title] = position.description;
        });
        types.forEach(type => {
            descriptions.type[type.title] = type.description;
        });
        openguards.forEach(openguard => {
            descriptions.openGuard[openguard.title] = openguard.description;
        });

        return descriptions;
    }
);

export const fetchDescriptionsIfOld = createAsyncThunk(
    'descriptions/fetchDescriptionsIfOld',
    async (_, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;

        const lastUpdated = state.descriptions.lastUpdated;

        if (lastUpdated) {
            const now = Date.now();
            const expiryTime = Number(process.env.REACT_APP_DATA_EXPIRY_MS || '300000'); // 5 minutes by default

            if (now - lastUpdated > expiryTime) {
                return thunkAPI.dispatch(fetchDescriptionsAsync());
            }
        } else {
            // If lastUpdated is not available, fetch descriptions
            return thunkAPI.dispatch(fetchDescriptionsAsync());
        }
    }
);

const descriptionsSlice = createSlice({
    name: 'descriptions',
    initialState,
    reducers: {
        updateDescriptions: (state, action: PayloadAction<Technique | Collection>) => {
            const item = action.payload;
        
            if (item.position && item.position.title) {
                state.descriptions.position[item.position.title] = item.position.description;
            }
            if (item.type && item.type.title) {
                state.descriptions.type[item.type.title] = item.type.description;
            }
            if (item.openGuard && item.openGuard.title) {
                state.descriptions.openGuard[item.openGuard.title] = item.openGuard.description;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDescriptionsAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDescriptionsAsync.fulfilled, (state, action) => {
                state.descriptions.position = action.payload.position;
                state.descriptions.type = action.payload.type;
                state.descriptions.openGuard = action.payload.openGuard;
                state.loading = false;
                state.lastUpdated = Date.now();
            })
            .addCase(fetchDescriptionsAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch descriptions';
            });
    },
});

export const { updateDescriptions } = descriptionsSlice.actions;
export default descriptionsSlice.reducer;
