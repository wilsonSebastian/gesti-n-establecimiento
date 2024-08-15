const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');  // Para comparar contraseñas hasheadas
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

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

// Ruta para manejar el login
app.post('/api/login', (req, res) => {
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
                return res.status(401).json({ message: 'Contraseña incorrecta, contactarse con administrador' });
            }

            // Aquí puedes generar un token JWT o simplemente devolver un éxito
            res.json({ message: 'Login exitoso', user });
        });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

