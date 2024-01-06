import { configureStore } from "@reduxjs/toolkit";
import { syllabusTrackerApi } from "../services/syllabusTrackerApi";
import rootReducer from "./rootReducer";


export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(syllabusTrackerApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
