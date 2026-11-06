import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const kinesioSchema = new mongoose.Schema(
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
    especialidad: {
      type: String,
      trim: true,
      default: "Kinesiología General",
    },
    rol: {
      type: String,
      default: "kinesio",
    },
  },
  {
    timestamps: true,
  }
);

// Encriptar contraseña antes de guardar el documento
kinesioSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Método para verificar la contraseña en el inicio de sesión
kinesioSchema.methods.validarPassword = async function (passwordIngresada) {
  return await bcrypt.compare(passwordIngresada, this.password);
};

export default mongoose.models.Kinesio || mongoose.model("Kinesio", kinesioSchema);