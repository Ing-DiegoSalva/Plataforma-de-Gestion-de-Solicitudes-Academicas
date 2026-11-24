const mongoose = require('mongoose');
const Solicitud = require('../models/Solicitud');

class SolicitudService {
    async listarSolicitudes(filtros = {}) {
        const query = {};

        for (const campo of ['estudiante', 'curso', 'descripcion']) {
            if (filtros[campo]) {
                query[campo] = { $regex: filtros[campo], $options: 'i' };
            }
        }

        if (filtros.estado) {
            if (!Solicitud.ESTADOS_VALIDOS.includes(filtros.estado)) {
                const error = new Error('Estado no valido');
                error.statusCode = 400;
                throw error;
            }
            query.estado = filtros.estado;
        }

        return Solicitud.find(query).sort({ createdAt: -1 });
    }

    async obtenerSolicitudPorId(id) {
        this.validarId(id);
        return Solicitud.findById(id);
    }

    async crearSolicitud(datos) {
        return Solicitud.create(datos);
    }

    async actualizarSolicitud(id, datos, validarCompletitud = false) {
        this.validarId(id);

        if (validarCompletitud) {
            const { estudiante, curso, descripcion, estado } = datos;
            if (!estudiante || !curso || !descripcion || !estado) {
                const error = new Error('Todos los campos son obligatorios para actualizar');
                error.statusCode = 400;
                throw error;
            }
        }

        return Solicitud.findByIdAndUpdate(id, datos, {
            new: true,
            runValidators: true
        });
    }

    async eliminarSolicitud(id) {
        this.validarId(id);
        return Solicitud.findByIdAndDelete(id);
    }

    validarId(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            const error = new Error('ID de solicitud no valido');
            error.statusCode = 400;
            throw error;
        }
    }
}

module.exports = new SolicitudService();
