import React from 'react';
import Sidebar from './Sidebar'; // Sidebar plegable que muestra nombre y opciones

function Dashboard({ user }) {
    if (!user) {
        return null; // Evitar el renderizado si no hay usuario
    }

    return (
        <div className="dashboard-container">
            <Sidebar user={user} />
            <div className="content">
                {/* Contenido del dashboard según el rol del usuario */}
                <h1>Bienvenido, {user.role}</h1>
                {user.role === 'Administrador' && (
                    <div>
                        <h2>Administrar Usuarios</h2>
                        {
                        /* Aquí se incluiría la lógica para CRUD de usuarios */
                        <a href="/AdminUsuarios">Recuperar clave</a>
                        }
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
