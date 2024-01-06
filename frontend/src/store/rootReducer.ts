import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../slices/auth';
import collectionsReducer from '../slices/collections';
import techniquesReducer from '../slices/techniques';
import suggestionsReducer from '../slices/suggestions';
import collectionTechniquesReducer from '../slices/collectionTechniques';
import descriptionsReducer from '../slices/descriptions';
import studentReducer from '../slices/student';
import { syllabusTrackerApi } from '../services/syllabusTrackerApi';

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

export default rootReducer;
