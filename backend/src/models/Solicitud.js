const mongoose = require('mongoose');

const ESTADOS_VALIDOS = ['Pendiente', 'En revision', 'Aprobada', 'Rechazada'];

const solicitudSchema = new mongoose.Schema({
    estudiante: {
        type: String,
        required: [true, 'El estudiante es obligatorio'],
        trim: true,
        minlength: [3, 'El estudiante debe tener al menos 3 caracteres'],
        maxlength: [100, 'El estudiante no puede exceder los 100 caracteres']
    },
    curso: {
        type: String,
        required: [true, 'El curso es obligatorio'],
        trim: true,
        minlength: [3, 'El curso debe tener al menos 3 caracteres'],
        maxlength: [100, 'El curso no puede exceder los 100 caracteres']
    },
    descripcion: {
        type: String,
        required: [true, 'La descripcion es obligatoria'],
        trim: true,
        minlength: [5, 'La descripcion debe tener al menos 5 caracteres'],
        maxlength: [500, 'La descripcion no puede exceder los 500 caracteres']
    },
    estado: {
        type: String,
        enum: {
            values: ESTADOS_VALIDOS,
            message: 'El estado no es valido'
        },
        default: 'Pendiente'
    }
}, {
    timestamps: true,
    collection: 'solicituds'
});

const Solicitud = mongoose.model('Solicitud', solicitudSchema);
Solicitud.ESTADOS_VALIDOS = ESTADOS_VALIDOS;

module.exports = Solicitud;
