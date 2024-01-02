import React from 'react';
import { Role } from 'common'
import StudentDashboard from '../users/student/Dashboard';
import CoachDashboard from '../users/coach/Dashboard';
import { useAuth0 } from '@auth0/auth0-react'
import BaseLayout from '../../components/Base/BaseLayout';
import { decodeAndAddRole } from '../../util/Utilities';
import { useDispatch } from 'react-redux';
import { setAccessToken } from '../../slices/auth';
import { AppDispatch } from '../../store/store';


const DashboardPage: React.FC = () => {
    
    let { user } = useAuth0();
    const { getAccessTokenSilently } = useAuth0();
    const dispatch = useDispatch<AppDispatch>();

    React.useEffect(() => {
        const getAccessToken = async () => {
            try {
                const token = await getAccessTokenSilently();
                dispatch(setAccessToken(token))

            } catch (error) {
                console.log(error);
            }
        };

        getAccessToken();
    }, [getAccessTokenSilently, dispatch]);

    if (user) {user = decodeAndAddRole(user)}

    if (!user) {
      return null;
    }
    
    let content: React.ReactNode = <div></div>

    switch(user.role) {
        case Role.Student:
        content = <StudentDashboard/>
        break;

        case Role.Coach:
            content = <CoachDashboard/>
        break;

        case Role.Admin:
            content = (
                <div>
                    <p>Hello Admin!</p>
                    <p>Home page placeholder</p>
                </div>
        )
        break;
    }

    return (
        <BaseLayout text="Dashboard">
            <div className="home-container">
                {content}
            </div>
        </BaseLayout>
    );
};

export default DashboardPage;
