const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, {
    collection: "usuarios" // Fuerza a Mongoose a usar exactamente la colección 'usuarios'
});

// Método simple para comparar contraseñas en texto plano
usuarioSchema.methods.validarPassword = function (passwordIngresada) {
    return this.password === passwordIngresada;
};

module.exports = mongoose.model("Usuario", usuarioSchema);