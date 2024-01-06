import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { CollectionSet } from 'common'
import { RootState } from '../store/store'

export const syllabusTrackerApi = createApi({
    reducerPath: 'syllabbusTrackerApi',
    baseQuery: fetchBaseQuery({ 
        baseUrl: `${process.env.REACT_APP_API_SERVER_URL}`,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.accessToken
            if (token) { headers.set('Authorization', `Bearer ${token}`) }
            headers.set('Content-Type', 'application/json')
            return headers
        }
    }),
    endpoints: (build) => ({
        getCollectionSets: build.query<CollectionSet[], void>({
            query: () => `collectionset`,
        }),
    }),
})

export const { useGetCollectionSetsQuery } = syllabusTrackerApi
