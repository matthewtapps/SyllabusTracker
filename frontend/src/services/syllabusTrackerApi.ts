import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Collection, CollectionSet, CollectionTechnique, StudentTechnique, Technique, TechniqueStatus } from 'common'
import { RootState } from '../store/store'
import { User } from '@auth0/auth0-react'


const baseUrl = `${process.env.REACT_APP_API_SERVER_URL}`
if (!baseUrl) throw new Error(`Error with baseURL - is env variable set?`)

export const syllabusTrackerApi = createApi({
    reducerPath: 'syllabbusTrackerApi',
    baseQuery: fetchBaseQuery({
        baseUrl: baseUrl,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.accessToken
            if (token) { headers.set('Authorization', `Bearer ${token}`) }
            headers.set('Content-Type', 'application/json')
            return headers
        }
    }),
    tagTypes: ['Techniques', 'Types', 'Positions', 'OpenGuards', 'Collections', 'CollectionTechniques', 'Students', 'StudentTechniques', 'CollectionSets'],
    endpoints: (build) => ({
        // Technique queries and mutations
        getTechniques: build.query<Technique[], void>({
            query: () => `technique`,
            providesTags: (result) =>
                result ?
                    [
                        ...result.map(({ techniqueId }) => ({ type: 'Techniques' as const, techniqueId })),
                        { type: 'Techniques', id: 'LIST' }
                    ]
                    : [{ type: 'Techniques', id: 'LIST' }]
        }),
        postNewTechnique: build.mutation<Technique, Partial<Technique>>({
            query: technique => ({
                url: `technique`,
                method: 'POST',
                body: technique
            }),
            invalidatesTags: [{ type: 'Techniques', id: 'LIST' }]
        }),
        editTechnique: build.mutation<Technique, Partial<Technique>>({
            query: technique => ({
                url: `technique/${technique.techniqueId}`,
                method: 'PUT',
                body: technique
            }),
            invalidatesTags: [
                { type: 'Techniques', id: 'LIST' },
                { type: 'Types', id: 'LIST' },
                { type: 'Positions', id: 'LIST' },
                { type: 'OpenGuards', id: 'LIST' }
            ]
        }),
        deleteTechnique: build.mutation<void, string>({
            query: techniqueId => ({
                url: `technique/${techniqueId}`,
                method: 'DELETE',
            }),
            invalidatesTags: [
                { type: 'Techniques', id: 'LIST' },
                { type: 'CollectionTechniques', id: 'LIST' },
                { type: 'StudentTechniques', id: 'LIST' },
            ]
        }),

        // Additional technique data queries
        getTypes: build.query<{ title: string, description: string }[], void>({
            query: () => `type`,
            providesTags: (result) =>
                result ?
                    [
                        ...result.map(({ title }) => ({ type: 'Types' as const, title })),
                        { type: 'Types', id: 'LIST' }
                    ]
                    : [{ type: 'Types', id: 'LIST' }]
        }),
        getPositions: build.query<{ title: string, description: string }[], void>({
            query: () => `position`,
            providesTags: (result) =>
                result ?
                    [
                        ...result.map(({ title }) => ({ type: 'Positions' as const, title })),
                        { type: 'Positions', id: 'LIST' }
                    ]
                    : [{ type: 'Positions', id: 'LIST' }]
        }),
        getOpenGuards: build.query<{ title: string, description: string }[], void>({
            query: () => `openGuard`,
            providesTags: (result) =>
                result ?
                    [
                        ...result.map(({ title }) => ({ type: 'OpenGuards' as const, title })),
                        { type: 'OpenGuards', id: 'LIST' }
                    ]
                    : [{ type: 'OpenGuards', id: 'LIST' }]
        }),

        // Collection queries and mutations
        getCollections: build.query<Collection[], void>({
            query: () => `collection`,
            providesTags: (result) =>
                result ?
                    [
                        ...result.map(({ collectionId }) => ({ type: 'Collections' as const, collectionId })),
                        { type: 'Collections', id: 'LIST' }
                    ]
                    : [{ type: 'Collections', id: 'LIST' }]
        }),
        postNewCollection: build.mutation<Collection, Partial<Collection>>({
            query: collection => ({
                url: `collection`,
                method: 'POST',
                body: collection
            }),
            invalidatesTags: [
                { type: 'Collections', id: 'LIST' },
                { type: 'Types', id: 'LIST' },
                { type: 'Positions', id: 'LIST' },
                { type: 'OpenGuards', id: 'LIST' }
            ]
        }),
        editCollection: build.mutation<Collection, Partial<Collection>>({
            query: collection => ({
                url: `collection/${collection.collectionId}`,
                method: 'PUT',
                body: collection
            }),
            invalidatesTags: [
                { type: 'Collections', id: 'LIST' },
                { type: 'Types', id: 'LIST' },
                { type: 'Positions', id: 'LIST' },
                { type: 'OpenGuards', id: 'LIST' }
            ]
        }),
        deleteCollection: build.mutation<void, string>({
            query: collectionId => ({
                url: `collection/${collectionId}`,
                method: 'DELETE',
            }),
            invalidatesTags: [
                { type: 'Collections', id: 'LIST' },
                { type: 'CollectionTechniques', id: 'LIST' },
            ]
        }),

        // Collection technique queries and mutations
        getCollectionTechniques: build.query<CollectionTechnique[], void>({
            query: () => `collectiontechnique`,
            providesTags: (result) =>
                result ?
                    [
                        ...result.map(({ collectionTechniqueId }) => ({ type: 'CollectionTechniques' as const, collectionTechniqueId })),
                        { type: 'CollectionTechniques', id: 'LIST' }
                    ]
                    : [{ type: 'CollectionTechniques', id: 'LIST' }]
        }),
        setCollectionTechniques: build.mutation<CollectionTechnique[], { collectionId: string, collectionTechniques: { index: number, technique: Technique }[] }>({
            query: data => ({
                url: `collection/${data.collectionId}`,
                method: `POST`,
                body: data.collectionTechniques
            }),
            invalidatesTags: [
                { type: 'Collections', id: 'LIST' },
                { type: 'CollectionTechniques', id: 'LIST' },
            ]
        }),

        // Students queries and mutations
        getStudents: build.query<User[], void>({
            query: () => `student`,
            transformResponse: (response: User[], meta, arg) => {
                return response.map(user => {
                    return {
                        ...user,
                        sub: user.sub?.replace("auth0|", "")
                    }
                })
            },
            providesTags: (result) =>
                result ?
                    [
                        ...result.map(({ sub }) => ({ type: 'Students' as const, sub })),
                        { type: 'Students', id: 'LIST' }
                    ]
                    : [{ type: 'Students', id: 'LIST' }]
        }),
        getSelectedStudentTechniques: build.query<StudentTechnique[], string>({
            query: studentId => `student/${studentId}/technique`,
            providesTags: (result) =>
                result ?
                    [
                        ...result.map(({ studentTechniqueId }) => ({ type: 'StudentTechniques' as const, studentTechniqueId })),
                        { type: 'StudentTechniques', id: 'LIST' }
                    ]
                    : [{ type: 'StudentTechniques', id: 'LIST' }]
        }),
        postStudentTechniques: build.mutation<StudentTechnique[], { studentId: string, status: TechniqueStatus, techniques: Technique[] }>({
            query: data => ({
                url: `student/${data.studentId}/technique`,
                method: `POST`,
                body: { status: data.status, techniques: data.techniques }
            }),
            invalidatesTags: [
                { type: 'StudentTechniques', id: 'LIST' },
            ]
        }),
        editStudentTechnique: build.mutation<StudentTechnique, { studentId: string, techniqueId: string, updatedData: Partial<StudentTechnique> }>({
            query: data => ({
                url: `student/${data.studentId}/technique/${data.techniqueId}`,
                method: `PUT`,
                body: data.updatedData
            }),
            invalidatesTags: [
                { type: 'StudentTechniques', id: 'LIST' },
            ]
        }),
        getAllStudentTechniques: build.query<StudentTechnique[], void>({
            query: () => `student/technique`,
            providesTags: (result) =>
                result ?
                    [
                        ...result.map(({ studentTechniqueId }) => ({ type: 'StudentTechniques' as const, studentTechniqueId })),
                        { type: 'StudentTechniques', id: 'LIST' }
                    ]
                    : [{ type: 'StudentTechniques', id: 'LIST' }]
        }),
        deleteStudentTechnique: build.mutation<void, string>({
            query: studentTechniqueId => ({
                url: `student/technique/${studentTechniqueId}`,
                method: 'DELETE',
            }),
            invalidatesTags: [
                { type: 'StudentTechniques', id: 'LIST' },
            ]
        }),

        // Collection sets queries and mutations
        getCollectionSets: build.query<CollectionSet[], void>({
            query: () => `collectionset`,
            providesTags: (result) =>
                result ?
                    [
                        ...result.map(({ collectionSetId }) => ({ type: 'CollectionSets' as const, collectionSetId })),
                        { type: 'CollectionSets', id: 'LIST' }
                    ]
                    : [{ type: 'CollectionSets', id: 'LIST' }]
        }),
        postCollectionSet: build.mutation<CollectionSet, Partial<CollectionSet>>({
            query: collectionSet => ({
                url: `collectionset`,
                method: `POST`,
                body: collectionSet
            }),
            invalidatesTags: [
                { type: 'CollectionSets', id: 'LIST' },
            ]
        }),
        editCollectionSet: build.mutation<CollectionSet, Partial<CollectionSet>>({
            query: collectionSet => ({
                url: `collectionset/${collectionSet.collectionSetId}`,
                method: `PUT`,
                body: collectionSet
            }),
            invalidatesTags: [
                { type: 'CollectionSets', id: 'LIST' },
            ]
        }),
        deleteCollectionSet: build.mutation<void, string>({
            query: collectionSetId => ({
                url: `collectionset/${collectionSetId}`,
                method: `DELETE`
            }),
            invalidatesTags: [
                { type: 'CollectionSets', id: 'LIST' },
            ]
        })
    }),
})

export const { useGetCollectionSetsQuery } = syllabusTrackerApi
