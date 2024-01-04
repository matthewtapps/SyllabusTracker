import { useAuth0 } from '@auth0/auth0-react';
import { Role } from 'common';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BaseLayout from '../../components/Base/BaseLayout';
import { fetchCollectionTechniquesAsync } from '../../slices/collectionTechniques';
import { fetchCollectionsIfOld } from '../../slices/collections';
import { fetchCollectionSuggestionsIfOld, fetchTechniqueSuggestionsIfOld } from '../../slices/suggestions';
import { fetchTechniquesIfOld } from '../../slices/techniques';
import { AppDispatch, RootState } from '../../store/store';
import { decodeAndAddRole } from '../../util/Utilities';
import CoachCollections from '../users/coach/Collections';
import StudentCollections from '../users/student/Collections';
import { shouldRefreshToken, setAccessToken } from '../../slices/auth';


const CollectionsPage: React.FC = () => {
    let { user } = useAuth0();

    const { getAccessTokenSilently } = useAuth0();
    const dispatch = useDispatch<AppDispatch>();
    const state = useSelector((state: RootState) => state);

    React.useEffect(() => {
        const getAccessToken = async () => {
            try {
                if (shouldRefreshToken(state)) {
                    const token = await getAccessTokenSilently();
                    dispatch(setAccessToken(token))
                }

            } catch (error) {
                console.log(error);
            }
        };

        getAccessToken();
    }, [getAccessTokenSilently, dispatch, state]);

    React.useEffect(() => {
        dispatch(fetchCollectionsIfOld());
        dispatch(fetchCollectionSuggestionsIfOld());
        dispatch(fetchTechniqueSuggestionsIfOld())
        dispatch(fetchTechniquesIfOld())
        dispatch(fetchCollectionTechniquesAsync())
    }, [dispatch]);

    if (user) { user = decodeAndAddRole(user) }

    if (!user) {
        return null;
    }

    let content: React.ReactNode = <div></div>

    switch (user.role) {
        case Role.Student:
            content = <StudentCollections />
            break;

        case Role.Coach:
            content = <CoachCollections />
            break;

        case Role.Admin:
            content = (
                <div>
                    <p>Hello Admin!</p>
                    <p>Collections page placeholder</p>
                </div>
            )
            break;
    }

    return (
        <BaseLayout text="Collections">
            <div className="home-container">
                {content}
            </div>
        </BaseLayout>
    );
}

export default CollectionsPage;
