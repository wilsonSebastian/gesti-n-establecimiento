import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Registro.css';

function Registro() {
    const [formData, setFormData] = useState({
        rut: '',
        nombre: '',
        apellido: '',
        correo_electronico: '',
        rol: 'Estudiante', // Valor por defecto
        contraseña: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post('http://localhost:5000/api/usuarios', formData)
            .then(response => {
                setSuccess('Usuario registrado correctamente');
                setError('');
                setTimeout(() => {
                    navigate('/'); // Redirigir a la página de login después de un registro exitoso
                }, 2000);
            })
            .catch(error => {
                console.error('Error al registrar el usuario:', error);
                setError('Hubo un error al registrar el usuario.');
                setSuccess('');
            });
    };

    return (
        <div className="registro-container">
            <h2>Registro de Usuario</h2>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>RUT:</label>
                    <input type="text" name="rut" value={formData.rut} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Nombre:</label>
                    <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Apellido:</label>
                    <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Correo Electrónico:</label>
                    <input type="email" name="correo_electronico" value={formData.correo_electronico} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Rol:</label>
                    <select name="rol" value={formData.rol} onChange={handleChange}>
                        <option value="Estudiante">Estudiante</option>
                        <option value="Profesor">Profesor</option>
                        <option value="Administrador">Administrador</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Contraseña:</label>
                    <input type="password" name="contraseña" value={formData.contraseña} onChange={handleChange} required />
                </div>
                <button type="submit" className="btn">Registrar</button>
            </form>
        </div>
    );
}

export default Registro;
