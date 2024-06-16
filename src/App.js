// src/App.js
import React, { useState } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';
import './App.css';

const App = () => {
    const [token, setToken] = useState(null);

    return (
        <div>
            {token ? <Dashboard token={token} /> : <Login setToken={setToken} />}
        </div>
    );
};

export default App;