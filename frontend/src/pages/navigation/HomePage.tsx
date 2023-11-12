import React from 'react';
import { Role, Belt, Stripes } from 'common'
import { ThemeProvider } from '@emotion/react';
import theme from '../../theme/Theme';
import StudentDashboard from '../users/student/Home';


interface HomePageProps {
    user: {userId: string, role: Role}
}

const HomePage: React.FC<HomePageProps> = (props) => {

    let content: React.ReactNode
    
    switch(props.user.role) {
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
