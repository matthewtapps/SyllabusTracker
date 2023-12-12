import React from 'react';
import { Role } from 'common'
import StudentTechniques from '../users/student/Techniques';
import CoachTechniques from '../users/coach/Techniques';
import { useAuth0 } from '@auth0/auth0-react'
import BaseLayout from '../../components/Base/BaseLayout';
import { decodeAndAddRole } from '../../util/Utilities';


const TechniquesPage: React.FC = () => {

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
