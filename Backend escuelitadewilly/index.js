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
    max: 5, // Limita cada IP a 5 solicitudes por "windowMs"
    message: "Demasiados intentos de login, por favor intenta de nuevo después de 15 minutos."
});

// Middleware para verificar JWT y proteger rutas
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Acceso denegado, se requiere un token.' });

    jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Token inválido.' });
        
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
        return res.status(400).json({ errors: errors.array() });
    }

    const { rut, contraseña } = req.body;

    const sql = 'SELECT * FROM usuarios WHERE rut = ?';
    db.query(sql, [rut], (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }

        const user = results[0];

        // Compara la contraseña proporcionada con la almacenada en la base de datos
        bcrypt.compare(contraseña, user.contraseña, (err, isMatch) => {
            if (err) return res.status(500).send(err);
            if (!isMatch) {
                return res.status(401).json({ message: 'Contraseña incorrecta' });
            }

            // Genera un token JWT
            const token = jwt.sign(
                { id: user.id, rol: user.rol },
                'your_jwt_secret', // Cambia esto por un secreto más seguro
                { expiresIn: '1h' }
            );

            res.json({ message: 'Login exitoso', token, rol: user.rol });
        });
    });
});

app.post('/api/usuarios', [
    body('rut').isLength({ min: 7, max: 12 }).trim().escape(),
    body('nombre').not().isEmpty().trim().escape(),
    body('apellido').not().isEmpty().trim().escape(),
    body('correo_electronico').isEmail().normalizeEmail(),
    body('rol').isIn(['Estudiante', 'Profesor', 'Administrador']),
    body('contraseña').isLength({ min: 5 }).escape()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rut, nombre, apellido, correo_electronico, rol, contraseña } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(contraseña, salt);

        const sql = 'INSERT INTO usuarios (rut, nombre, apellido, correo_electronico, rol, contraseña) VALUES (?, ?, ?, ?, ?, ?)';
        db.query(sql, [rut, nombre, apellido, correo_electronico, rol, hashedPassword], (err, result) => {
            if (err) return res.status(500).json({ error: 'Error al registrar el usuario' });

            res.status(201).json({ message: 'Usuario registrado correctamente' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error registrando el usuario' });
    }
});

// Ruta para obtener todos los usuarios (nueva)
app.get('/api/usuarios', verifyToken, (req, res) => {
    const sql = 'SELECT * FROM usuarios';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// Rutas protegidas según el rol del usuario
app.get('/api/estudiante', verifyToken, (req, res) => {
    if (req.userRole === 'Estudiante') {
        res.json({ message: 'Bienvenido Estudiante' });
    } else {
        res.status(403).json({ message: 'No tienes acceso a esta ruta' });
    }
});

app.get('/api/profesor', verifyToken, (req, res) => {
    if (req.userRole === 'Profesor') {
        res.json({ message: 'Bienvenido Profesor' });
    } else {
        res.status(403).json({ message: 'No tienes acceso a esta ruta' });
    }
});

app.get('/api/administrador', verifyToken, (req, res) => {
    if (req.userRole === 'Administrador') {
        res.json({ message: 'Bienvenido Administrador' });
    } else {
        res.status(403).json({ message: 'No tienes acceso a esta ruta' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
