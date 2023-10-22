import React from 'react';
import { Role } from 'common'
import { ThemeProvider } from '@emotion/react';
import theme from '../theme/Theme';
import StudentTechniques from './student/Techniques';

const TechniquesPage: React.FC = () => {
    const user = {
        userId: 'test',
        role: Role.Student
    }
    
    let content: React.ReactNode
    switch(user.role) {
        case Role.Student:
        content = StudentTechniques()
        break;

        case Role.Coach:
            content = (
                <div>
                    <p>Hello Coach!</p>
                    <p>Techniques page placeholder</p>
                </div>
        )
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

    return (
        <ThemeProvider theme={theme}>
            <div className="home-container">
                {content}
            </div>
        </ThemeProvider>
    );
};

export default TechniquesPage;
