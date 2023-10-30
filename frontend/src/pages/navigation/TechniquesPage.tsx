import React from 'react';
import { Role } from 'common'
import { ThemeProvider } from '@emotion/react';
import theme from '../../theme/Theme';
import StudentTechniques from '../users/student/Techniques';
import CoachTechniques from '../users/coach/Techniques';

const TechniquesPage: React.FC = () => {
    const user = {
        userId: 'test',
        role: Role.Coach
    }
    
    let content: React.ReactNode
    switch(user.role) {
        case Role.Student:
        content = StudentTechniques()
        break;

        case Role.Coach:
            content = CoachTechniques()
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
