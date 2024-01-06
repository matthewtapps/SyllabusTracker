import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { syllabusTrackerApi } from "../services/syllabusTrackerApi";
import authReducer from '../slices/auth';
import collectionsReducer from '../slices/collections';
import techniquesReducer from '../slices/techniques';
import suggestionsReducer from '../slices/suggestions';
import collectionTechniquesReducer from '../slices/collectionTechniques';
import descriptionsReducer from '../slices/descriptions';
import studentReducer from '../slices/student';


const rootReducer = combineReducers({
    auth: authReducer,
    collections: collectionsReducer,
    techniques: techniquesReducer,
    suggestions: suggestionsReducer,
    collectionTechniques: collectionTechniquesReducer,
    descriptions: descriptionsReducer,
    student: studentReducer,
    [syllabusTrackerApi.reducerPath]: syllabusTrackerApi.reducer    
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(syllabusTrackerApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
