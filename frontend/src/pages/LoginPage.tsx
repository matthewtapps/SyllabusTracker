import React, { useState } from 'react';
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom';
import '../css/login.css'

interface LoginData {
    username: string,
    password: string
};

const studentLogin: LoginData = {
    username: 'Liam',
    password: 'Test'
}

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginLabel, setLoginLabel] = useState('Login');
    const navigate = useNavigate();

    async function handleSubmit(event: React.SyntheticEvent) {
        event.preventDefault();
        setLoginLabel('Wait...');

        const loginData: LoginData = {username, password}
        
        if (loginData.username === studentLogin.username &&
            loginData.password === studentLogin.password) {
            navigate("/")
        } else { alert("Invalid login provided") };
        setLoginLabel('Login')
        // Send username & password for auth to backend.
        // Upon passing auth, fill User instance and ensure this is hoisted to upper 
        // app logic to be easily referred to.
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
                <Button variant="outlined" type="submit">{loginLabel}</Button>
            </form>
        </div>
    );
};

export default LoginPage;
