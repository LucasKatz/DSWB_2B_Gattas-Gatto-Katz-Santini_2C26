const mongoose = require("mongoose");

const kinesioSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: [true, "El ID es obligatorio"],
        unique: true
    },
    nombre: {
        type: String,
        required: [true, "El nombre es obligatorio"],
        trim: true
    },
    apellido: {
        type: String,
        required: [true, "El apellido es obligatorio"],
        trim: true
    },
    especialidad: {
        type: String,
        required: [true, "La especialidad es obligatoria"],
        trim: true
    },
    rol: {
        type: String,
        default: "kinesiologo"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Kinesio", kinesioSchema);