// LogoutButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <button onClick={handleLogout} className="btn logout-btn">Cerrar sesión</button>
    );
}

export default LogoutButton;
