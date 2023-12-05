import React from 'react';
import { Role } from 'common'
import StudentDashboard from '../users/student/Home';
import CoachDashboard from '../users/coach/Home';
import { useAuth0 } from '@auth0/auth0-react'
import BaseLayout from '../../components/BaseLayout';
import { decodeAndAddRole } from '../../util/Utilities';


const DashboardPage: React.FC = () => {
    
    let { user } = useAuth0();

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
