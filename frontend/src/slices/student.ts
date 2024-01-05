import { User } from "@auth0/auth0-react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { StudentTechnique, Technique, TechniqueStatus } from "common";
import { RootState } from "../store/store";
import { deleteStudentTechnique, fetchStudentTechniques, fetchStudents, postStudentTechniques, stripAuth0FromUserId, updateStudentTechnique } from "../util/Utilities";


interface StudentState {
    students: User[];
    selectedStudent: User | null;
    selectedStudentTechniques: StudentTechnique[];
    selectedStudentTechniquesLastUpdated: number | null;
    allStudentTechniques: StudentTechnique[];
    postingOrUpdatingStudentTechniqueIds: string[];
    loading: boolean;
    error: string | null;
}

const initialState: StudentState = {
    students: [],
    selectedStudent: null,
    selectedStudentTechniques: [],
    selectedStudentTechniquesLastUpdated: null,
    allStudentTechniques: [],
    postingOrUpdatingStudentTechniqueIds: [],
    loading: false,
    error: null,
};

export const fetchStudentsAsync = createAsyncThunk(
    'student/fetchStudentsAsync',
    async (_, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        const token = state.auth.accessToken;
        if (!token) {
            throw new Error('No access token available');
        }
        return await fetchStudents(token);
    }
);

export const fetchSelectedStudentTechniquesAsync = createAsyncThunk(
    'student/fetchStudentTechniquesAsync',
    async (_, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        const token = state.auth.accessToken;
        if (!token) {
            throw new Error('No access token available');
        }
        const selectedStudent = state.student.selectedStudent
        if (!selectedStudent) { throw new Error(`No student selected`) }
        return await fetchStudentTechniques(selectedStudent.user_id, token);
    }
);

export const postStudentTechniquesAsync = createAsyncThunk(
    'student/postStudentTechniquesAsync',
    async (data: {techniques: Technique[], status: TechniqueStatus}, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        const token = state.auth.accessToken;
        if (!token) {
            throw new Error('No access token available');
        }
        const selectedStudentId = state.student.selectedStudent?.user_id
        if (!selectedStudentId) {
            throw new Error('No student selected')
        }
        return await postStudentTechniques(selectedStudentId, data.techniques, data.status, token)
    }
);

export const updateStudentTechniqueAsync = createAsyncThunk(
    'student/updateStudentTechniqueAsync',
    async (data: { techniqueId: string, updatedData: Partial<StudentTechnique> }, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        const token = state.auth.accessToken;
        if (!token) {
            throw new Error('No access token available');
        }
        const selectedStudentId = state.student.selectedStudent?.user_id
        if (!selectedStudentId) {
            throw new Error('No student selected')
        }
        return await updateStudentTechnique(selectedStudentId, data.techniqueId, data.updatedData, token)
    }
);

export const deleteStudentTechniqueAsync = createAsyncThunk(
    'student/deleteStudentTechniqueAsync',
    async (studentTechniqueId: string, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        const token = state.auth.accessToken;
        if (!token) {
            throw new Error('No access token available');
        }
        const response = await deleteStudentTechnique(studentTechniqueId, token)
        if (response !== 200) { throw new Error(`Error deleting student technique`) }
        return studentTechniqueId
    }
);

export const fetchSelectedStudentTechniquesIfOld = createAsyncThunk(
    'student/fetchStudentTechniquesIfOld',
    async (_, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        const selectedStudent = state.student.selectedStudent;
        const lastUpdated = state.student.selectedStudentTechniquesLastUpdated;

        if (!selectedStudent) {
            throw new Error('No student selected');
        }

        if (lastUpdated) {
            const now = Date.now();
            const expiryTime = Number(process.env.REACT_APP_DATA_EXPIRY_MS || '300000'); // 5 minutes by default

            if (now - lastUpdated > expiryTime) {
                return thunkAPI.dispatch(fetchSelectedStudentTechniquesAsync());
            }
        } else {
            return thunkAPI.dispatch(fetchSelectedStudentTechniquesAsync());
        }
    }
);

const studentSlice = createSlice({
    name: 'student',
    initialState,
    reducers: {
        selectStudent: (state, action: PayloadAction<User>) => {
            state.selectedStudent = action.payload
            if (state.selectedStudent.user_id) {
                state.selectedStudent = {
                    ...state.selectedStudent,
                    user_id: stripAuth0FromUserId(state.selectedStudent.user_id)
                }
            } else if (state.selectedStudent.sub) {
                state.selectedStudent = {
                    ...state.selectedStudent,
                    user_id: stripAuth0FromUserId(state.selectedStudent.sub)
                }
            } else throw new Error(`Failed to strip user ID from given user object`)
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch students
            .addCase(fetchStudentsAsync.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchStudentsAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.students = action.payload;
            })
            .addCase(fetchStudentsAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch students';
            })

            // Fetch student techniques for a given student
            .addCase(fetchSelectedStudentTechniquesAsync.pending, (state) => {
            })
            .addCase(fetchSelectedStudentTechniquesAsync.fulfilled, (state, action) => {
                state.selectedStudentTechniques = action.payload;
            })
            .addCase(fetchSelectedStudentTechniquesAsync.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to fetch student techniques';
            })

            // Post student techniques
            .addCase(postStudentTechniquesAsync.pending, (state, action) => {
                state.postingOrUpdatingStudentTechniqueIds = action.meta.arg.techniques.map(t => t.techniqueId)
            })
            .addCase(postStudentTechniquesAsync.fulfilled, (state, action) => {
                action.payload.map(studentTechnique =>
                    state.selectedStudentTechniques.push(studentTechnique)
                )
                state.postingOrUpdatingStudentTechniqueIds = []
            })
            .addCase(postStudentTechniquesAsync.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to post student techniques';
                state.postingOrUpdatingStudentTechniqueIds = []
            })

            // Delete student technique
            .addCase(deleteStudentTechniqueAsync.pending, (state) => {
            })
            .addCase(deleteStudentTechniqueAsync.fulfilled, (state, action) => {
                state.selectedStudentTechniques = state.selectedStudentTechniques.filter(st =>
                    st.studentTechniqueId !== action.payload
                )
            })
            .addCase(deleteStudentTechniqueAsync.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to delete student technique';
            })

            // Update student technique
            .addCase(updateStudentTechniqueAsync.pending, (state, action) => {
                state.postingOrUpdatingStudentTechniqueIds = [action.meta.arg.techniqueId]
            })
            .addCase(updateStudentTechniqueAsync.fulfilled, (state, action) => {
                const index = state.selectedStudentTechniques.findIndex(st => st.studentTechniqueId === action.payload.studentTechniqueId);
                if (index !== -1) {
                    state.selectedStudentTechniques[index] = { ...state.selectedStudentTechniques[index], ...action.payload };
                }
                state.postingOrUpdatingStudentTechniqueIds = []
            })
            .addCase(updateStudentTechniqueAsync.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to delete student technique';
                state.postingOrUpdatingStudentTechniqueIds = []
            })
            // Fetch student techniques if old
            .addCase(fetchSelectedStudentTechniquesIfOld.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchSelectedStudentTechniquesIfOld.fulfilled, (state) => {
                state.loading = false;
                // Update the lastUpdated timestamp
                state.selectedStudentTechniquesLastUpdated = Date.now();
            })
            .addCase(fetchSelectedStudentTechniquesIfOld.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to check if student techniques are old';
            });
    },
});

export const { selectStudent } = studentSlice.actions;
export default studentSlice.reducer;
