import { useAuth0 } from '@auth0/auth0-react';
import { Role } from 'common';
import React from 'react';
import BaseLayout from '../../components/Base/BaseLayout';
import { decodeAndAddRole } from '../../util/Utilities';
import CoachDashboard from '../users/coach/Dashboard';
import StudentDashboard from '../users/student/Dashboard';
import { sec } from '../../store/security';


const DashboardPage: React.FC = () => {
    const { getAccessTokenSilently } = useAuth0();
    sec.setAccessTokenSilently(getAccessTokenSilently);
    const { user } = useAuth0()
    const enhancedUser = user && decodeAndAddRole(user)

    return (
        <BaseLayout text="Dashboard">
            {enhancedUser && (
                enhancedUser.role === Role.Student ? <StudentDashboard />
                : enhancedUser.role === Role.Coach ? <CoachDashboard />
                : enhancedUser.role === Role.Admin && <p>Admin dashboard page placeholder</p>
            )}

        </BaseLayout>
    )
};

export default DashboardPage;
