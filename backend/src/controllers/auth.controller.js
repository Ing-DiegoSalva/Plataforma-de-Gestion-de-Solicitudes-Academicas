const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const opcionesCookie = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
};

// Registrar usuario
const registrar = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        if (!nombre || !email || typeof password !== 'string'
            || password.length < 6
            || Buffer.byteLength(password, 'utf8') > 72) {
            return res.status(400).json({
                mensaje: 'Datos de registro inválidos'
            });
        }

        const correo = email.trim().toLowerCase();

        const usuarioExistente = await Usuario.findOne({
            email: correo
        });

        if (usuarioExistente) {
            return res.status(409).json({
                mensaje: 'El correo ya está registrado'
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const usuario = await Usuario.create({
            nombre,
            email: correo,
            password: passwordHash,
            rol: 'estudiante'
        });

        return res.status(201).json({
            mensaje: 'Usuario registrado correctamente',
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol
            }
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                mensaje: 'El correo ya está registrado'
            });
        }

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                mensaje: error.message
            });
        }

        return res.status(500).json({
            mensaje: 'Error al registrar usuario'
        });
    }
};

// Iniciar sesión
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (typeof email !== 'string' ||
            typeof password !== 'string' ||
            !email.trim() || !password) {
            return res.status(400).json({
                mensaje: 'Ingrese correo y contraseña'
            });
        }

        const usuario = await Usuario.findOne({
            email: email.trim().toLowerCase()
        });

        if (!usuario || !usuario.activo) {
            return res.status(401).json({
                mensaje: 'Credenciales incorrectas'
            });
        }

        const passwordValido = await bcrypt.compare(
            password,
            usuario.password
        );

        if (!passwordValido) {
            return res.status(401).json({
                mensaje: 'Credenciales incorrectas'
            });
        }

        const token = jwt.sign(
            {
                id: usuario._id.toString(),
                rol: usuario.rol
            },
            process.env.JWT_SECRET,
            {
                algorithm: 'HS256',
                expiresIn: process.env.JWT_EXPIRES_IN || '1h'
            }
        );

        res.cookie('token', token, {
            ...opcionesCookie,
            maxAge: 60 * 60 * 1000
        });

        return res.status(200).json({
            mensaje: 'Sesión iniciada correctamente',
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol
            }
        });

    } catch (error) {
    console.error('Error en login:', error);

    return res.status(500).json({
        mensaje: 'Error al iniciar sesión'
    });
}
};

// Obtener usuario autenticado
const obtenerUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findById(
            req.usuario.id
        ).select('-password');

        if (!usuario || !usuario.activo) {
            return res.status(401).json({
                mensaje: 'Usuario no disponible'
            });
        }

        return res.status(200).json({
            usuario
        });

    } catch (error) {
        return res.status(500).json({
            mensaje: 'Error al obtener usuario'
        });
    }
};

// Cerrar sesión
const logout = (req, res) => {
    res.clearCookie('token', opcionesCookie);

    return res.status(200).json({
        mensaje: 'Sesión cerrada correctamente'
    });
};

module.exports = {
    registrar,
    login,
    obtenerUsuario,
    logout
};