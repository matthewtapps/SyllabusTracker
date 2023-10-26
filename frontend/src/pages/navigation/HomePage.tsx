import React from 'react';
import { Role, Belt, Stripes } from 'common'
import { ThemeProvider } from '@emotion/react';
import theme from '../../theme/Theme';
import StudentDashboard from '../users/student/Home';


const HomePage: React.FC = () => {
    const user = {
        userId: '1',
        role: Role.Student,
        username: 'Liam',
        firstName: 'Liam',
        lastName: 'Heaver',
        dateOfBirth: new Date(1963, 1, 24),
        email: 'example@example.com',
        mobile: '0400000000',
        rank: {belt: Belt.White, stripes: Stripes.Four}
    }           // Could be moved to login page logic
                                   // once auth is implemented and hoisted to 
                                   // higher app state for easy referring
    
    let content: React.ReactNode
    switch(user.role) {
        case Role.Student:
        content = <StudentDashboard/>
        break;

        case Role.Coach:
            content = (
                <div>
                    <p>Hello Coach!</p>
                    <p>Home page placeholder</p>
                </div>
        )
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
        <ThemeProvider theme={theme}>
            <div className="home-container">
                {content}
            </div>
        </ThemeProvider>
    );
};

export default HomePage;
