require('dotenv').config();

const express = require('express');
const cors = require('cors');
const conectarDB = require('./database');
const solicitudesRoutes = require('./routes/solicitudes.routes');



const app = express();
const PORT = process.env.PORT || 3000;

const origenesPermitidos = (process.env.FRONTEND_URL ||
    'http://localhost:5173,http://localhost:4200')
    .split(',')
    .map((origen) => origen.trim());

app.use(cors({ origin: origenesPermitidos }));
app.use(express.json());


// Ruta principal
app.get('/', (req, res) => {
    res.json({
        mensaje: 'API de Gestion de Solicitudes Academicas',
        estado: 'OK'
    });
});

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
