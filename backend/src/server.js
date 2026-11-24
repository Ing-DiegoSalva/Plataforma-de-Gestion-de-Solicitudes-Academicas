require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const conectarDB = require('./database');
const solicitudesRoutes = require('./routes/solicitudes.routes');
const authRoutes = require('./routes/auth.routes');


const app = express();
const PORT = process.env.PORT || 3000;

const origenesPermitidos = (process.env.FRONTEND_URL ||
    'http://localhost:5173,http://localhost:4200')
    .split(',')
    .map((origen) => origen.trim());

app.use(cors({ 
    origin: origenesPermitidos,
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Ruta principal
app.get('/', (req, res) => {
    res.json({
        mensaje: 'API de Gestion de Solicitudes Academicas',
        estado: 'OK'
    });
});

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Rutas del CRUD de solicitudes
app.use('/api/solicitudes', solicitudesRoutes);


// Middleware para rutas inexistentes
app.use((req, res) => {
    res.status(404).json({
        mensaje: 'Ruta no encontrada'
    });
});

// Conectar a MongoDB e iniciar el servidor
async function iniciarServidor() {
    await conectarDB();

    return app.listen(PORT, () => {
        console.log(`Servidor ejecutandose en http://localhost:${PORT}`);
    });
}

if (require.main === module) {
    iniciarServidor();
}

module.exports = { app, iniciarServidor };
