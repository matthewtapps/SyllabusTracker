import { useAuth0 } from '@auth0/auth0-react';
import { Role } from 'common';
import React from 'react';
import BaseLayout from '../../components/Base/BaseLayout';
import { decodeAndAddRole } from '../../util/Utilities';
import CoachStudents from '../users/coach/Students';


const StudentsPage: React.FC = () => {
    const { user } = useAuth0()
    const enhancedUser = user && decodeAndAddRole(user)

    return (
        <BaseLayout text="Collections">
            {enhancedUser && (
                enhancedUser.role === Role.Student ? <p>Invalid permissions</p>
                    : enhancedUser.role === Role.Coach ? <CoachStudents />
                        : enhancedUser.role === Role.Admin && <p>Admin Collections page placeholder</p>
            )}

        </BaseLayout>
    );
}


export default StudentsPage;
