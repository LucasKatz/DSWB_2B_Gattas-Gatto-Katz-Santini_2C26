import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const pacienteSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "El email es obligatorio"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
    },
    rol: {
      type: String,
      default: "paciente",
    },
  },
  {
    timestamps: true,
  }
);

// Encriptar contraseña antes de guardar en la base de datos
pacienteSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Método para comparar la contraseña en el inicio de sesión
pacienteSchema.methods.validarPassword = async function (passwordIngresada) {
  return await bcrypt.compare(passwordIngresada, this.password);
};

export default mongoose.models.Paciente || mongoose.model("Paciente", pacienteSchema);