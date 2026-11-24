const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const verificarToken = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            mensaje: 'No has iniciado sesión'
        });
    }

    let datos;

    try {
        datos = jwt.verify(token, process.env.JWT_SECRET, {
            algorithms: ['HS256']
        });

    } catch (error) {
        return res.status(401).json({
            mensaje: error.name === 'TokenExpiredError'
                ? 'La sesión ha expirado'
                : 'Token inválido'
        });
    }

    try {
        const usuario = await Usuario.findById(datos.id)
            .select('-password');

        if (!usuario || !usuario.activo) {
            return res.status(401).json({
                mensaje: 'Usuario no disponible'
            });
        }

        req.usuario = {
            id: usuario._id.toString(),
            rol: usuario.rol
        };

        next();

    } catch (error) {
        return res.status(500).json({
            mensaje: 'Error al verificar la sesión'
        });
    }
};

module.exports = { verificarToken };