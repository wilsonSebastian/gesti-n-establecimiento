import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, Link } from 'react-router-dom'; 
import axios from 'axios';
import logoCMI from './escuela.jpg';
import Dashboard from './Dashboard';
import Registro from './Registro'; // Importa el componente de registro
import './App.css';




    function Login({ setUser }) {
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
                    localStorage.setItem('role', rol);
    
                    setUser({ name: 'Usuario', role: rol });
    
                    if (rol === 'Estudiante') {
                        navigate('/estudiante', );
                    } else if (rol === 'Profesor') {
                        navigate('/profesor', );
                    } else if (rol === 'Administrador') {
                        navigate('/administrador', );
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
                        <Link to="/registro">Registrar Usuario</Link>
                    </div>
                </div>
            </div>
        );
}


function App() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userRole = localStorage.getItem('role');

        if (token && userRole) {
            setUser({ name: 'Usuario', role: userRole });

            // Redirección solo si el usuario está en la página de login
            if (window.location.pathname === '/') {
                if (userRole === 'Estudiante') {
                    navigate('/estudiante');
                } else if (userRole === 'Profesor') {
                    navigate('/profesor');
                } else if (userRole === 'Administrador') {
                    navigate('/administrador');
                }
            }
        } else {
            // No redireccionar si se intenta acceder a la página de registro
            if (window.location.pathname !== '/registro') {
                navigate('/');
            }
        }

        // Limpia el token y el rol del localStorage cuando la ventana se cierra o recarga
        window.addEventListener('beforeunload', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
        });

        return () => {
            window.removeEventListener('beforeunload', () => {
                localStorage.removeItem('token');
                localStorage.removeItem('role');
            });
        };
    }, [navigate]);

    return (
        <Routes>
            <Route path="/" element={<Login setUser={setUser} />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/estudiante" element={<Dashboard user={user} />} />
            <Route path="/profesor" element={<Dashboard user={user} />} />
            <Route path="/administrador" element={<Dashboard user={user} />} />
        </Routes>
    );
}



export default App;
