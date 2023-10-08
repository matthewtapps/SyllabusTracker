import React from 'react';
import { User, Role, fetchUser } from 'common'
import { studentDashboard } from './student/StudentDashboard';

const HomePage: React.FC = () => {
    const user: User = fetchUser()
    
    let content: React.ReactNode
    switch(user.role) {
        case Role.Student:
        content = studentDashboard(user)
        break;
        
        case Role.Coach:
            content = (
                <div>
                    <p>Hello Coach!</p>
                    <p>Dashboard goes here</p>
                </div>
        )
        break;
        
        case Role.Admin:
            content = (
                <div>
                    <p>Hello Admin!</p>
                    <p>Dashboard goes here</p>
                </div>
        )
        break;
    }

    return (
        <div className="home-container">
            {content}
        </div>
    );
};

export default HomePage;