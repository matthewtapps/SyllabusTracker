import React from 'react';
import { Role } from 'common'
import { ThemeProvider } from '@emotion/react';
import theme from '../../theme/Theme';
import NewModule from '../users/coach/NewModule';

const NewModulePage: React.FC = () => {
    const user = {
        userId: 'test',
        role: Role.Coach
    }      
    
    let content: React.ReactNode
    switch(user.role) {
        case Role.Student:
        content = (
            <div>
                <p>Incorrect permissions</p>
                <p>New Module Placeholder</p>
            </div>
        )
        break;

        case Role.Coach:
            content = <NewModule/>
        break;
        
        case Role.Admin:
            content = (
                <div>
                    <p>Hello Admin!</p>
                    <p>New Module Placeholder</p>
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

export default NewModulePage;
