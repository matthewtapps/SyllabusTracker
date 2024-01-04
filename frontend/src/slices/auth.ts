import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store/store';


interface AuthState {
    accessToken: string | null;
    lastUpdated: number | null;
    checkingTokenAge: boolean;
}

const initialState: AuthState = {
    accessToken: null,
    lastUpdated: null,
    checkingTokenAge: false
};



const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAccessToken: (state, action: PayloadAction<string | null>) => {
            state.accessToken = action.payload;
            state.lastUpdated = Date.now()
        },
    },
});

export const { setAccessToken } = authSlice.actions;
export default authSlice.reducer;

export function shouldRefreshToken(state: RootState): boolean {
    const lastUpdated = state.auth.lastUpdated;
    if (lastUpdated) {
        const now = Date.now();
        const expiryTime = Number(process.env.REACT_APP_DATA_EXPIRY_MS || '300000');
        return now - lastUpdated > expiryTime;
    }
    return true; // Refresh if no lastUpdated is set
};
