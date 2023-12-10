import React from 'react';
import { Role } from 'common'
import { useAuth0 } from '@auth0/auth0-react'
import BaseLayout from '../../components/BaseLayout';
import { decodeAndAddRole } from '../../util/Utilities';
import CoachStudents from '../users/coach/Students';


const StudentsPage: React.FC = () => {

    let { user } = useAuth0();

    if (user) {user = decodeAndAddRole(user)}

    if (!user) {
      return null;
    }
    
    let content: React.ReactNode = <div></div>

    switch(user.role) {
        case Role.Student:
            content = <div>Invalid permissions</div>
        break;

        case Role.Coach:
            content = <CoachStudents/>
        break;
        
        case Role.Admin:
            content = (
                <div>
                    <p>Hello Admin!</p>
                    <p>Students page placeholder</p>
                </div>
        )
        break;
        }

    return (
        <BaseLayout text="Students">
            <div className="home-container">
                {content}
            </div>
        </BaseLayout>
    );
}

export default StudentsPage;
