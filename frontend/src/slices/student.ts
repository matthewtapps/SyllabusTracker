import { User } from "@auth0/auth0-react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { StudentTechnique, Technique } from "common";
import { RootState } from "../store/store";
import { deleteStudentTechnique, fetchStudentTechniques, fetchStudents, postStudentTechniques, stripAuth0FromUserId, updateStudentTechnique } from "../util/Utilities";


interface StudentState {
    students: User[];
    selectedStudent: User | null;
    selectedStudentTechniques: StudentTechnique[];
    allStudentTechniques: StudentTechnique[];
    loading: boolean;
    error: string | null;
}

const initialState: StudentState = {
    students: [],
    selectedStudent: null,
    selectedStudentTechniques: [],
    allStudentTechniques: [],
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

export const fetchStudentTechniquesAsync = createAsyncThunk(
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
    async (techniques: Technique[], thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        const token = state.auth.accessToken;
        if (!token) {
            throw new Error('No access token available');
        }
        const selectedStudentId = state.student.selectedStudent?.user_id
        if (!selectedStudentId) {
            throw new Error('No student selected')
        }
        return await postStudentTechniques(selectedStudentId, techniques, token)
    }
);

export const updateStudentTechniqueAsync = createAsyncThunk(
    'student/updateStudentTechniqueAsync',
    async (data: {techniqueId: string, updatedData: Partial<StudentTechnique>}, thunkAPI) => {
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

const studentSlice = createSlice({
    name: 'student',
    initialState,
    reducers: {
        selectStudent: (state, action: PayloadAction<User>) => {
            state.selectedStudent = action.payload
            state.selectedStudent = {
                ...state.selectedStudent,
                user_id: stripAuth0FromUserId(state.selectedStudent.user_id)
            }
        }
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
            .addCase(fetchStudentTechniquesAsync.pending, (state) => {
            })
            .addCase(fetchStudentTechniquesAsync.fulfilled, (state, action) => {
                state.selectedStudentTechniques = action.payload;
            })
            .addCase(fetchStudentTechniquesAsync.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to fetch student techniques';
            })
            // Post student techniques
            .addCase(postStudentTechniquesAsync.pending, (state) => {
            })
            .addCase(postStudentTechniquesAsync.fulfilled, (state, action) => {
                action.payload.map(studentTechnique =>
                    state.selectedStudentTechniques.push(studentTechnique)
                )
            })
            .addCase(postStudentTechniquesAsync.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to post student techniques';
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
            .addCase(updateStudentTechniqueAsync.pending, (state) => {
            })
            .addCase(updateStudentTechniqueAsync.fulfilled, (state, action) => {
                const index = state.selectedStudentTechniques.findIndex(st => st.studentTechniqueId === action.payload.studentTechniqueId);
                if (index !== -1) {
                    state.selectedStudentTechniques[index] = {...state.selectedStudentTechniques[index], ...action.payload};
                }
            })
            .addCase(updateStudentTechniqueAsync.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to delete student technique';
            })
    },
});

export const { selectStudent } = studentSlice.actions;
export default studentSlice.reducer;
