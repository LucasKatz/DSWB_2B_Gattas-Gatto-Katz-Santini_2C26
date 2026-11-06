import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const usuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    rol: { type: String, enum: ["admin", "kinesio", "paciente"], default: "paciente" }
}, { timestamps: true });

usuarioSchema.pre("save", async function () {
    // Si la contraseña no se ha modificado, salimos de la función
    if (!this.isModified("password")) {
        return;
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Método para verificar contraseña
usuarioSchema.methods.validarPassword = async function (passwordIngresada) {
    return await bcrypt.compare(passwordIngresada, this.password);
};

export default mongoose.models.Usuario || mongoose.model("Usuario", usuarioSchema);