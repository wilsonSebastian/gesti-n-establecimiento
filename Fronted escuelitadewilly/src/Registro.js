import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Registro() {
    const [usuarios, setUsuarios] = useState([]);
    const [nuevoUsuario, setNuevoUsuario] = useState({ nombre: '', rut: '', correo_electronico: '', rol: '', contraseña: '' });
    const [editingUser, setEditingUser] = useState(null);

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const fetchUsuarios = () => {
        axios.get('http://localhost:5000/api/usuarios')
            .then(response => setUsuarios(response.data))
            .catch(error => console.error('Error al cargar usuarios:', error));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNuevoUsuario(prevState => ({
            ...prevState, 
            [name]: value
        }));
    };

    const handleRegisterOrUpdate = () => {
        if (editingUser) {
            axios.put(`http://localhost:5000/api/usuarios/${editingUser.id}`, nuevoUsuario)
                .then(() => {
                    fetchUsuarios();
                    setEditingUser(null);
                    setNuevoUsuario({ nombre: '', rut: '', correo_electronico: '', rol: '', contraseña: '' });
                    console.log('Usuario actualizado con éxito');
                })
                .catch(error => console.error('Error al actualizar usuario:', error));
        } else {
            axios.post('http://localhost:5000/api/usuarios', nuevoUsuario)
                .then(() => {
                    fetchUsuarios();
                    setNuevoUsuario({ nombre: '', rut: '', correo_electronico: '', rol: '', contraseña: '' });
                    console.log('Usuario registrado con éxito');
                })
                .catch(error => console.error('Error al registrar usuario:', error));
        }
    };

    const handleDelete = (id) => {
        axios.delete(`http://localhost:5000/api/usuarios/${id}`)
            .then(() => {
                fetchUsuarios();
                console.log('Usuario eliminado con éxito');
            })
            .catch(error => console.error('Error al eliminar usuario:', error));
    };

    const handleEdit = (usuario) => {
        setEditingUser(usuario);
        setNuevoUsuario({
            nombre: usuario.nombre,
            rut: usuario.rut,
            correo_electronico: usuario.correo_electronico,
            rol: usuario.rol,
            contraseña: '' // Leave blank for security reasons
        });
    };

    return (
        <div className="registro-container">
            <h2>{editingUser ? 'Actualizar Usuario' : 'Registrar Nuevo Usuario'}</h2>
            <input 
                type="text" 
                name="nombre" 
                value={nuevoUsuario.nombre} 
                onChange={handleChange} 
                placeholder="Nombre del usuario" 
            />
            <input 
                type="text" 
                name="rut" 
                value={nuevoUsuario.rut} 
                onChange={handleChange} 
                placeholder="RUT" 
            />
            <input 
                type="email" 
                name="email" 
                value={nuevoUsuario.correo_electronico} 
                onChange={handleChange} 
                placeholder="Correo Electrónico" 
            />
            <input 
                type="password" 
                name="contraseña" 
                value={nuevoUsuario.contraseña} 
                onChange={handleChange} 
                placeholder="Contraseña" 
            />
            <select 
                name="rol" 
                value={nuevoUsuario.rol} 
                onChange={handleChange}
            >
                <option value="">Seleccione un rol</option>
                <option value="Estudiante">Estudiante</option>
                <option value="Profesor">Profesor</option>
                <option value="Administrador">Administrador</option>
            </select>
            <button onClick={handleRegisterOrUpdate}>
                {editingUser ? 'Actualizar Usuario' : 'Registrar Usuario'}
            </button>

            <h2>Lista de Usuarios</h2>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>RUT</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map((usuario) => (
                        <tr key={usuario.id}>
                            <td>{usuario.nombre}</td>
                            <td>{usuario.rut}</td>
                            <td>{usuario.correo_electronico}</td>
                            <td>{usuario.rol}</td>
                            <td>
                                <button onClick={() => handleEdit(usuario)}>Editar</button>
                                <button onClick={() => handleDelete(usuario.id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Registro;