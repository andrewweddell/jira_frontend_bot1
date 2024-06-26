import React, { useState } from 'react';
import { ThemeProvider, CssBaseline, AppBar, Toolbar, IconButton, Container } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { lightTheme, darkTheme } from './theme';
import Login from './Login';
import Dashboard from './Dashboard';
import './App.css';

const App = () => {
    const [token, setToken] = useState(null);
    const [darkMode, setDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
            <CssBaseline />
            <Container maxWidth="md">
                <AppBar position="static" sx={{ background: 'transparent', boxShadow: 'none', borderRadius: 2, marginTop: 2 }}>
                    <Toolbar>
                        <IconButton edge="end" color="inherit" onClick={toggleDarkMode}>
                            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <div>
                    {token ? <Dashboard token={token} /> : <Login setToken={setToken} />}
                </div>
            </Container>
        </ThemeProvider>
    );
};

export default App;