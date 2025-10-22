const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 5000;

// Configuración de la base de datos (leída desde variables de entorno)
const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
});

// Función para crear la tabla si no existe
const initializeDatabase = async () => {
    try {
        await pool.query(
            `CREATE TABLE IF NOT EXISTS usuarios (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL
            )`
        );
        console.log("Tabla 'usuarios' verificada/creada exitosamente.");
    } catch (err) {
        console.error("Error al inicializar la base de datos:", err.stack);
        // Reintentar conexión, Docker puede tardar en levantar la DB
        setTimeout(initializeDatabase, 5000);
    }
};

// ----- ENDPOINTS REQUERIDOS -----

// Endpoint con mi apellido Pinto
app.get('/Pinto', (req, res) => {
    res.json({ nombre_completo: "José Antonio Pinto Aguilar" });
});

// ----- ENDPOINTS CRUD -----

// CREATE (Crear un usuario)
app.post('/usuarios', async (req, res) => {
    const { nombre } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO usuarios (nombre) VALUES ($1) RETURNING *",
            [nombre]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// READ (Obtener todos los usuarios)
app.get('/usuarios', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM usuarios ORDER BY id ASC");
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Iniciar el servidor y la base de datos
app.listen(PORT, () => {
    console.log(`API corriendo en el puerto ${PORT}`);
    initializeDatabase();
});
