import React, { useState } from 'react';
import Button from '@mui/material/Button'
import { Navigate } from 'react-router';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        <Navigate to="/"></Navigate>
        };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
            <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg" className="dominance-triangle">
                <path d="M 110 10 L 200 190 L 20 190 Z"/>
            </svg>
                <div>
                    <label htmlFor="username">Username: </label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoComplete="username"
                        />
                </div>
                <div>
                    <label htmlFor="password">Password: </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        />
                </div>
                <Button variant="outlined" type="submit">Login</Button>
            </form>
        </div>
    );
};

export default LoginPage;