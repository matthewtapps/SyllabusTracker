import React from 'react';
import { User, Role, fetchUser } from 'common'
import { ThemeProvider } from '@emotion/react';
import theme from '../theme/Theme';
import StudentTechniques from './student/Techniques';

const TechniquesPage: React.FC = () => {
    const user: User = fetchUser() // Could be moved to login page logic
                                   // once auth is implemented and hoisted to 
                                   // higher app state for easy referring
    
    let content: React.ReactNode
    switch(user.role) {
        case Role.Student:
        content = StudentTechniques()
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

export default TechniquesPage;