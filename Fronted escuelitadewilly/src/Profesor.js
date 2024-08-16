import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function Profesor() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/', { replace: true });
    };

    return (
        <div className="dashboard">
            <h2>Bienvenido, Profesor</h2>
            <button className="logout-btn" onClick={handleLogout}>
                Cerrar Sesión
            </button>
        </div>
    );
}

export default Profesor;