import React from 'react';
import { Role} from 'common'
import { ThemeProvider } from '@emotion/react';
import theme from '../../theme/Theme';
import NewTechnique from '../users/coach/NewTechnique';

const NewTechniquePage: React.FC = () => {
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
            </div>
        )
        break;

        case Role.Coach:
            content = <NewTechnique/>
        break;
        
        case Role.Admin:
            content = (
                <div>
                    <p>Hello Admin!</p>
                    <p>New Technique Placeholder</p>
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

export default NewTechniquePage;
