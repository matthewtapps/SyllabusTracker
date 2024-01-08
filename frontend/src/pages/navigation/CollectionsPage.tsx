import { useAuth0 } from '@auth0/auth0-react';
import { Role } from 'common';
import React from 'react';
import BaseLayout from '../../components/Base/BaseLayout';
import CoachCollections from '../users/coach/Collections';
import StudentCollections from '../users/student/Collections';
import { decodeAndAddRole } from '../../util/Utilities';


const CollectionsPage: React.FC = () => {
    const { user } = useAuth0()

    if (!user) return null

    const enhancedUser =  decodeAndAddRole(user)

    return (
        <BaseLayout text="Collections">
            {enhancedUser && (
                enhancedUser.role === Role.Student ? <StudentCollections />
                : enhancedUser.role === Role.Coach ? <CoachCollections />
                : enhancedUser.role === Role.Admin && <p>Admin Collections page placeholder</p>
            )}

        </BaseLayout>
    );
}

export default CollectionsPage;
