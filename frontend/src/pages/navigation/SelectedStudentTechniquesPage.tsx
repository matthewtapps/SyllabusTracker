import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import BaseLayout from '../../components/Base/BaseLayout';
import { fetchSelectedStudentTechniquesIfOld } from '../../slices/student';
import { fetchTechniqueSuggestionsIfOld } from '../../slices/suggestions';
import { fetchTechniquesIfOld } from '../../slices/techniques';
import { AppDispatch, RootState } from '../../store/store';
import SelectedStudentTechniques from '../users/coach/SelectedStudentTechniques';
import { useAuth0 } from '@auth0/auth0-react';
import { shouldRefreshToken, setAccessToken } from '../../slices/auth';


const SelectedStudentTechniquesPage: React.FC = () => {
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
    
    const { selectedStudent } = useSelector((state: RootState) => state.student)

    React.useEffect(() => {
        if (!selectedStudent) {
            navigate('/')
        }
    }, [selectedStudent, navigate]);

    React.useEffect(() => {
        dispatch(fetchTechniquesIfOld());
        dispatch(fetchTechniqueSuggestionsIfOld());
        dispatch(fetchSelectedStudentTechniquesIfOld());
    }, [dispatch]);

    return (
        <BaseLayout text={`${selectedStudent?.name} Techniques`}>
            <div className="home-container">
                <SelectedStudentTechniques/>
            </div>
        </BaseLayout>
    );
};

export default SelectedStudentTechniquesPage;
