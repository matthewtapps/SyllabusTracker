import { useAuth0 } from '@auth0/auth0-react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import BaseLayout from '../../components/Base/BaseLayout';
import { setAccessToken, shouldRefreshToken } from '../../slices/auth';
import { fetchCollectionsIfOld } from '../../slices/collections';
import { fetchSelectedStudentTechniquesIfOld } from '../../slices/student';
import { fetchCollectionSuggestionsIfOld } from '../../slices/suggestions';
import { AppDispatch, RootState } from '../../store/store';
import SelectedStudentCollections from '../users/coach/SelectedStudentCollections';


const SelectedStudentCollectionsPage: React.FC = () => {
    const navigate = useNavigate();
    const { getAccessTokenSilently } = useAuth0();
    const dispatch = useDispatch<AppDispatch>();
    const state = useSelector((state: RootState) => state.auth);

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
        dispatch(fetchSelectedStudentTechniquesIfOld());
        dispatch(fetchCollectionSuggestionsIfOld());
    }, [dispatch]);

    const { selectedStudent } = useSelector((state: RootState) => state.student)

    React.useEffect(() => {
        if (!selectedStudent) {
            navigate('/')
        }
    }, [selectedStudent, navigate]);

    return (
        <BaseLayout text={`${selectedStudent?.name} Collections`}>
            <div className="home-container">
                <SelectedStudentCollections />
            </div>
        </BaseLayout>
    );
};

export default SelectedStudentCollectionsPage;
