const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
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
    rol: {
        type: String,
        default: "admin"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Admin", adminSchema);