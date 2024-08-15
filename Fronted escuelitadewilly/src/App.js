import React, { useState } from 'react';
import axios from 'axios';
import logoCMI from './escuela.jpg';
import logoEduprotic from './escuela.jpg';
import './App.css';

function App() {
    const [rut, setRut] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // Enviar los datos al backend
        axios.post('http://localhost:5000/api/login', {
            rut,
            contraseña
        })
        .then(response => {
            console.log('Login exitoso:', response.data);
            // Aquí puedes redirigir al usuario o guardar el estado de autenticación
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
                    <h2>Bienvenido liceo digital</h2>
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
            
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
