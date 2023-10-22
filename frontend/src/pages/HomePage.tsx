import React from 'react';
import { User, Role } from 'common'
import { ThemeProvider } from '@emotion/react';
import theme from '../theme/Theme';
import StudentDashboard from './student/Home';


const HomePage: React.FC = () => {
    const user: User = {
        userId: 'test',
        role: Role.Student,
        username: 'Liam',
        firstName: 'Liam',
        lastName: 'Heaver',
        dateOfBirth: new Date(1995, 0, 24),
        email: 'test@example.com',
        mobile: '+61400000000'
    }           // Could be moved to login page logic
                                   // once auth is implemented and hoisted to 
                                   // higher app state for easy referring
    
    let content: React.ReactNode
    switch(user.role) {
        case Role.Student:
        content = StudentDashboard()
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
        <ThemeProvider theme={theme}>
            <div className="home-container">
                {content}
            </div>
        </ThemeProvider>
    );
};

export default HomePage;