import React from 'react';
import { Role } from 'common'
import StudentCollections from '../users/student/Collections';
import CoachCollections from '../users/coach/Collections';
import { useAuth0 } from '@auth0/auth0-react'
import BaseLayout from '../../components/Base/BaseLayout';
import { decodeAndAddRole } from '../../util/Utilities';


const CollectionsPage: React.FC = () => {

    let { user } = useAuth0();

    if (user) {user = decodeAndAddRole(user)}

    if (!user) {
      return null;
    }
    
    let content: React.ReactNode = <div></div>

    switch(user.role) {
        case Role.Student:
            content = <StudentCollections/>
        break;

        case Role.Coach:
            content = <CoachCollections/>
        break;
        
        case Role.Admin:
            content = (
                <div>
                    <p>Hello Admin!</p>
                    <p>Collections page placeholder</p>
                </div>
        )
        break;
        }

    return (
        <BaseLayout text="Collections">
            <div className="home-container">
                {content}
            </div>
        </BaseLayout>
    );
}

export default CollectionsPage;
