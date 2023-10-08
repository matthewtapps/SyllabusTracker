import React from 'react';
import { User } from '../../../shared/types/Types'
import { fetchUser }  from '../../../shared/utils/Functions'

const HomePage: React.FC = () => {
    const user: User = fetchUser()
    
        return (
            <div className="home-container">
                <p>Test home page</p>
            </div>
        );
};

export default HomePage;