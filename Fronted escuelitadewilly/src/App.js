import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom'; // Importa useNavigate
import logoCMI from './escuela.jpg';
import Estudiante from './Estudiante';
import Profesor from './Profesor';
import Administrador from './Administrador';
import './App.css';

function App() {
    const [rut, setRut] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Mueve useNavigate dentro del componente App

    const handleSubmit = (e) => {
        e.preventDefault();

        // Enviar los datos al backend
        axios.post('http://localhost:5000/api/login', {
            rut,
            contraseña
        })
        .then(response => {
            const { token, rol } = response.data;
            localStorage.setItem('token', token);

            // Redirigir basado en el rol del usuario
            if (rol === 'Estudiante') {
                navigate('/estudiante');
            } else if (rol === 'Profesor') {
                navigate('/profesor');
            } else if (rol === 'Administrador') {
                navigate('/administrador');
            }
        })
        .catch(error => {
            console.error('Hubo un error en el login:', error);
            setError('RUT o contraseña incorrectos.');
        });
    };

    return (
        <div className="App">
            <div className="background"></div>
            <div className="login-container">
                <div className="login-box">
                    <img src={logoCMI} alt="CMI Logo" className="logo" />
                    <h2>Bienvenido al libro de clases</h2>
                    {error && <p className="error">{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="RUT"
                                value={rut}
                                onChange={(e) => setRut(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                placeholder="Contraseña"
                                value={contraseña}
                                onChange={(e) => setContraseña(e.target.value)}
                            />
                        </div>
                        <div className="form-group remember">
                            <input type="checkbox" /> <label>Recordar datos</label>
                        </div>
                        <button type="submit" className="btn">Entrar</button>
                    </form>
                    <div className="footer-links">
                        <a href="#">Recuperar clave</a>
                        <a href="#">Contacto</a>
                        <a href="#">Verificar documento</a>
                    </div>
                </div>
            </div>

            {/* Rutas para cada rol */}
            <Routes>
                <Route path="/estudiante" element={<Estudiante />} />
                <Route path="/profesor" element={<Profesor />} />
                <Route path="/administrador" element={<Administrador />} />
            </Routes>
        </div>
    );
}

export default App;
