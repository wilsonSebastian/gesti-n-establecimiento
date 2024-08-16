import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminUsuarios.css';

function AdminUsuarios() {
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/usuarios')
            .then(response => {
                setUsuarios(response.data);
            })
            .catch(error => {
                console.error('Error al obtener usuarios:', error);
            });
    }, []);

    const handleDelete = (id) => {
        axios.delete(`http://localhost:5000/api/usuarios/${id}`)
            .then(() => {
                setUsuarios(usuarios.filter(user => user.id !== id));
            })
            .catch(error => {
                console.error('Error al eliminar usuario:', error);
            });
    };

    return (
        <div className="admin-usuarios">
            <h2>Administrar Usuarios</h2>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Rol</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map(user => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.role}</td>
                            <td>
                                <button onClick={() => handleDelete(user.id)}>Eliminar</button>
                                {/* Add Edit functionality */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminUsuarios;
