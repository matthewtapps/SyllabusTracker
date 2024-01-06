import { useAuth0 } from '@auth0/auth0-react';
import { Role } from 'common';
import React from 'react';
import BaseLayout from '../../components/Base/BaseLayout';
import { decodeAndAddRole } from '../../util/Utilities';
import CoachTechniques from '../users/coach/Techniques';
import StudentTechniques from '../users/student/Techniques';


const TechniquesPage: React.FC = () => {
    const { user } = useAuth0()
    const enhancedUser = user && decodeAndAddRole(user)

    return (
        <BaseLayout text="Collections">
            {enhancedUser && (
                enhancedUser.role === Role.Student ? <StudentTechniques />
                    : enhancedUser.role === Role.Coach ? <CoachTechniques />
                        : enhancedUser.role === Role.Admin && <p>Admin Techniques page placeholder</p>
            )}

        </BaseLayout>
    );
}


export default TechniquesPage;
