import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, Link } from 'react-router-dom'; 
import axios from 'axios';
import logoCMI from './escuela.jpg';
import Estudiante from './Estudiante';
import Profesor from './Profesor';
import Administrador from './Administrador';
import Registro from './Registro'; 
import './App.css';

function Login() {
    const [rut, setRut] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post('http://localhost:5000/api/login', { rut, contraseña })
        .then(response => {
            const { token, rol } = response.data;
            localStorage.setItem('token', token);

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
                <div className="register-link">
                    <Link to="/registro">Registrar Usuario</Link> {/* Botón para ir a la página de registro */}
                </div>
            </div>
        </div>
    );
}

function App() {
    return (
        <Router> {/* Este debe ser el único Router en la aplicación */}
            <div className="App">
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/registro" element={<Registro />} />
                    <Route path="/estudiante" element={<Estudiante />} />
                    <Route path="/profesor" element={<Profesor />} />
                    <Route path="/administrador" element={<Administrador />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;

