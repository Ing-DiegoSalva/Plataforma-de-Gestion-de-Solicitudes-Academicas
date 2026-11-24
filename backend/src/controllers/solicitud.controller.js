const solicitudService = require('../services/solicitud.service');

function responderErrorValidacion(res, error) {
    const detalles = Object.values(error.errors).map((item) => item.message);
    return res.status(400).json({
        mensaje: 'Error de validacion en la solicitud',
        detalles
    });
}

class SolicitudController {
    async obtenerTodas(req, res) {
        try {
            const solicitudes = await solicitudService.listarSolicitudes(req.query);
            return res.json(solicitudes);
        } catch (error) {
            if (error.statusCode === 400) {
                return res.status(400).json({ mensaje: error.message });
            }
            console.error('Error al consultar solicitudes:', error);
            return res.status(500).json({ mensaje: 'Error al consultar solicitudes' });
        }
    }

    async obtenerPorId(req, res) {
        try {
            const solicitud = await solicitudService.obtenerSolicitudPorId(req.params.id);
            if (!solicitud) {
                return res.status(404).json({ mensaje: 'Solicitud no encontrada' });
            }
            return res.json(solicitud);
        } catch (error) {
            if (error.statusCode === 400 || error.name === 'CastError') {
                return res.status(400).json({ mensaje: 'ID de solicitud no valido' });
            }
            console.error('Error al consultar la solicitud:', error);
            return res.status(500).json({ mensaje: 'Error interno del servidor' });
        }
    }

    async crear(req, res) {
        try {
            const { estudiante, curso, descripcion, estado } = req.body;
            if (!estudiante || !curso || !descripcion) {
                return res.status(400).json({
                    mensaje: 'Estudiante, curso y descripcion son obligatorios'
                });
            }
            const solicitud = await solicitudService.crearSolicitud({
                estudiante,
                curso,
                descripcion,
                estado
            });
            return res.status(201).json(solicitud);
        } catch (error) {
            if (error.name === 'ValidationError') {
                return responderErrorValidacion(res, error);
            }
            console.error('Error al crear la solicitud:', error);
            return res.status(500).json({ mensaje: 'Error al crear la solicitud' });
        }
    }

    async actualizar(req, res) {
        try {
            const { estudiante, curso, descripcion, estado } = req.body;
            if (!estudiante || !curso || !descripcion || !estado) {
                return res.status(400).json({
                    mensaje: 'Todos los campos son obligatorios para actualizar'
                });
            }
            const solicitud = await solicitudService.actualizarSolicitud(
                req.params.id,
                { estudiante, curso, descripcion, estado },
                true
            );
            if (!solicitud) {
                return res.status(404).json({ mensaje: 'Solicitud no encontrada' });
            }
            return res.json(solicitud);
        } catch (error) {
            if (error.name === 'ValidationError') return responderErrorValidacion(res, error);
            if (error.statusCode === 400 || error.name === 'CastError') {
                return res.status(400).json({ mensaje: error.message });
            }
            console.error('Error al actualizar la solicitud:', error);
            return res.status(500).json({ mensaje: 'Error al actualizar la solicitud' });
        }
    }

    async actualizarParcial(req, res) {
        try {
            const camposPermitidos = ['estudiante', 'curso', 'descripcion', 'estado'];
            const datos = {};
            for (const campo of camposPermitidos) {
                if (req.body[campo] !== undefined) datos[campo] = req.body[campo];
            }
            if (Object.keys(datos).length === 0) {
                return res.status(400).json({
                    mensaje: 'Debe enviar al menos un campo para actualizar'
                });
            }
            const solicitud = await solicitudService.actualizarSolicitud(req.params.id, datos);
            if (!solicitud) {
                return res.status(404).json({ mensaje: 'Solicitud no encontrada' });
            }
            return res.json(solicitud);
        } catch (error) {
            if (error.name === 'ValidationError') return responderErrorValidacion(res, error);
            if (error.statusCode === 400 || error.name === 'CastError') {
                return res.status(400).json({ mensaje: error.message });
            }
            console.error('Error al actualizar la solicitud:', error);
            return res.status(500).json({ mensaje: 'Error al actualizar la solicitud' });
        }
    }

    async eliminar(req, res) {
        try {
            const solicitud = await solicitudService.eliminarSolicitud(req.params.id);
            if (!solicitud) {
                return res.status(404).json({ mensaje: 'Solicitud no encontrada' });
            }
            return res.json({ mensaje: 'Solicitud eliminada correctamente', solicitud });
        } catch (error) {
            if (error.statusCode === 400 || error.name === 'CastError') {
                return res.status(400).json({ mensaje: 'ID de solicitud no valido' });
            }
            console.error('Error al eliminar la solicitud:', error);
            return res.status(500).json({ mensaje: 'Error al eliminar la solicitud' });
        }
    }
}

module.exports = new SolicitudController();
