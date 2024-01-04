import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import BaseLayout from '../../components/Base/BaseLayout';
import { AppDispatch, RootState } from '../../store/store';
import SelectedStudentDashboard from '../users/coach/SelectedStudentDashboard';
import { useAuth0 } from '@auth0/auth0-react';
import { shouldRefreshToken, setAccessToken } from '../../slices/auth';


const SelectedStudentDashboardPage: React.FC = () => {
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

    return (
        <BaseLayout text={selectedStudent?.name || "Student selection error"}>
            <div className="home-container">
                <SelectedStudentDashboard/>
            </div>
        </BaseLayout>
    );
};

export default SelectedStudentDashboardPage;
