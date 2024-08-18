const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { body, validationResult } = require('express-validator');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(helmet());

// Configurar la conexión a la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'escuela_db'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL!');
});

// Limitar el número de intentos de login
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 99, // Limita cada IP a 99 solicitudes por "windowMs"
    message: "Demasiados intentos de login, por favor intenta de nuevo después de 15 minutos."
});

// Middleware para verificar JWT y proteger rutas
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        console.log('Token no proporcionado');
        return res.status(401).json({ message: 'Acceso denegado, se requiere un token.' });
    }

    jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
        if (err) {
            console.log('Token inválido:', err);
            return res.status(403).json({ message: 'Token inválido.' });
        }

        req.userId = decoded.id;
        req.userRole = decoded.rol;
        next();
    });
};

// Ruta de login
app.post('/api/login', loginLimiter, [
    body('rut').isLength({ min: 7, max: 12 }).trim().escape(),
    body('contraseña').isLength({ min: 5 }).escape()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Errores de validación en login:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    const { rut, contraseña } = req.body;

    const sql = 'SELECT * FROM usuarios WHERE rut = ?';
    db.query(sql, [rut], (err, results) => {
        if (err) {
            console.log('Error al buscar usuario:', err);
            return res.status(500).send(err);
        }
        if (results.length === 0) {
            console.log('Usuario no encontrado:', rut);
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }

        const user = results[0];

        // Compara la contraseña proporcionada con la almacenada en la base de datos
        bcrypt.compare(contraseña, user.contraseña, (err, isMatch) => {
            if (err) {
                console.log('Error al comparar contraseñas:', err);
                return res.status(500).send(err);
            }
            if (!isMatch) {
                console.log('Contraseña incorrecta');
                return res.status(401).json({ message: 'Contraseña incorrecta' });
            }

            // Genera un token JWT
            const token = jwt.sign(
                { id: user.id, rol: user.rol },
                'your_jwt_secret', // Cambia esto por un secreto más seguro
                { expiresIn: '1h' }
            );

            console.log('Login exitoso para usuario:', rut);
            res.json({ message: 'Login exitoso', token, rol: user.rol });
        });
    });
});

// Ruta para registrar un nuevo usuario
app.post('/api/usuarios', [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio.'),
    body('rut').notEmpty().withMessage('El RUT es obligatorio.'),
    body('correo_electronico').isEmail().withMessage('El email debe ser válido.'),
    body('contraseña').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Errores de validación en registro:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    const { nombre, rut, correo_electronico, rol, contraseña } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(contraseña, 10);

        const sql = 'INSERT INTO usuarios (nombre, rut, correo_electronico, rol, contraseña) VALUES (?, ?, ?, ?, ?)';
        db.query(sql, [nombre, rut, correo_electronico, rol, hashedPassword], (err, result) => {
            if (err) {
                console.log('Error al registrar el usuario:', err);
                return res.status(500).json({ message: 'Error al registrar el usuario.' });
            }
            console.log('Usuario registrado con éxito:', nombre);
            res.status(201).json({ id: result.insertId, nombre, rut, correo_electronico, rol });
        });
    } catch (error) {
        console.log('Error en el servidor:', error);
        res.status(500).json({ message: 'Error en el servidor.' });
    }
});

// Ruta para obtener todos los usuarios
app.get('/api/usuarios', (req, res) => {
    const sql = 'SELECT * FROM usuarios';
    db.query(sql, (err, results) => {
        if (err) {
            console.log('Error al cargar los usuarios:', err);
            return res.status(500).json({ message: 'Error al cargar los usuarios.' });
        }
        console.log('Usuarios cargados con éxito');
        res.json(results);
    });
});

// Ruta para eliminar un usuario
app.delete('/api/usuarios/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM usuarios WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.log('Error al eliminar el usuario:', err);
            return res.status(500).json({ message: 'Error al eliminar el usuario.' });
        }
        if (result.affectedRows === 0) {
            console.log('Usuario no encontrado:', id);
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }
        console.log('Usuario eliminado con éxito:', id);
        res.json({ message: 'Usuario eliminado con éxito.' });
    });
});
app.put('/api/usuarios/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, rut,correo_electronico, rol, contraseña } = req.body;

    const sql = 'UPDATE usuarios SET nombre = ?, rut = ?, correo_electronico = ?, rol = ?, contraseña = ? WHERE id = ?';
    db.query(sql, [nombre, rut, correo_electronico, rol, contraseña, id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error al actualizar el usuario.' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }
        res.json({ message: 'Usuario actualizado con éxito.' });
    });
});
// Rutas protegidas según el rol del usuario
app.get('/api/estudiante', verifyToken, (req, res) => {
    if (req.userRole === 'Estudiante') {
        console.log('Acceso otorgado a Estudiante:', req.userId);
        res.json({ message: 'Bienvenido Estudiante' });
    } else {
        console.log('Acceso denegado a Estudiante:', req.userId);
        res.status(403).json({ message: 'No tienes acceso a esta ruta' });
    }
});

app.get('/api/profesor', verifyToken, (req, res) => {
    if (req.userRole === 'Profesor') {
        console.log('Acceso otorgado a Profesor:', req.userId);
        res.json({ message: 'Bienvenido Profesor' });
    } else {
        console.log('Acceso denegado a Profesor:', req.userId);
        res.status(403).json({ message: 'No tienes acceso a esta ruta' });
    }
});

app.get('/api/administrador', verifyToken, (req, res) => {
    if (req.userRole === 'Administrador') {
        console.log('Acceso otorgado a Administrador:', req.userId);
        res.json({ message: 'Bienvenido Administrador' });
    } else {
        console.log('Acceso denegado a Administrador:', req.userId);
        res.status(403).json({ message: 'No tienes acceso a esta ruta' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
