import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Sidebar({ user }) {
    const [isOpen, setIsOpen] = useState(true);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/', { replace: true });
    };

    return (
        <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <button onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? 'Cerrar' : 'Abrir'}
            </button>
            {isOpen && (
                <div className="sidebar-content">
                    <h3>{user.name}</h3>
                    <ul>
                        {user.role === 'Administrador' && (
                            <li><Link to="/admin/usuarios">Administrar Usuarios</Link></li>
                        )}
                        {/* Aquí podrías agregar más enlaces según el rol */}
                    </ul>
                    <button onClick={handleLogout} className="logout-btn">Cerrar Sesión</button>
                </div>
            )}
        </div>
    );
}

export default Sidebar;
