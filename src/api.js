// src/api.js
const API_URL = 'http://127.0.0.1:5000';

export const login = async (username, password) => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });
    if (!response.ok) {
        throw new Error('Login failed');
    }
    return response.json();
};

export const fetchBoards = async (token) => {
    const response = await fetch(`${API_URL}/fetch-boards`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch boards');
    }
    return response.json();
};

export const fetchSprint = async (token, boardId) => {
    const response = await fetch(`${API_URL}/fetch-sprint`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ board_id: boardId })
    });
    if (!response.ok) {
        throw new Error('Failed to fetch sprint');
    }
    return response.json();
};