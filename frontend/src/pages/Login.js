import React, { useState } from 'react';
import './Login.css';

import logo from '../assets/logo.svg';
import { api } from '../services/api';

export default function Login({ history }) {
    const [githubUsername, setGithubUsername] = useState('');

    async function handleSubmit(event) {
        event.preventDefault();

        const response = await api.post('/developers', {
            username: githubUsername,
        });

        const { _id } = response.data;
        history.push(`/developer/${_id}`);
    }

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <img src={logo} alt="Tindev" />
                <input
                    placeholder="Type your Github username"
                    value={githubUsername}
                    onChange={(e) => setGithubUsername(e.target.value)}
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
}
