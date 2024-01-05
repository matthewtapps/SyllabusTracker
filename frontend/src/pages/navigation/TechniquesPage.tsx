import { useAuth0 } from '@auth0/auth0-react';
import { Role } from 'common';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BaseLayout from '../../components/Base/BaseLayout';
import { setAccessToken, shouldRefreshToken } from '../../slices/auth';
import { fetchDescriptionsIfOld } from '../../slices/descriptions';
import { fetchTechniqueSuggestionsIfOld } from '../../slices/suggestions';
import { fetchTechniquesIfOld } from '../../slices/techniques';
import { AppDispatch, RootState } from '../../store/store';
import { decodeAndAddRole } from '../../util/Utilities';
import CoachTechniques from '../users/coach/Techniques';
import StudentTechniques from '../users/student/Techniques';
import { fetchSelectedStudentTechniquesIfOld } from '../../slices/student';


const TechniquesPage: React.FC = () => {
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
        dispatch(fetchTechniquesIfOld());
        dispatch(fetchTechniqueSuggestionsIfOld());
        dispatch(fetchSelectedStudentTechniquesIfOld());
        dispatch(fetchDescriptionsIfOld());
    }, [dispatch]);

    let { user } = useAuth0();

    if (user) {user = decodeAndAddRole(user)}

    if (!user) {
      return null;
    }
    
    let content: React.ReactNode = <div></div>

    if (user) {switch(user.role) {
        case Role.Student:
        content = <StudentTechniques/>
        break;

        case Role.Coach:
            content = <CoachTechniques/>
        break;
        
        case Role.Admin:
            content = (
                <div>
                    <p>Hello Admin!</p>
                    <p>Techniques page placeholder</p>
                </div>
        )
        break;
    }
}

    return (
        <BaseLayout text="Techniques">
            <div className="home-container">
                {content}
            </div>
        </BaseLayout>
    );
};

export default TechniquesPage;
