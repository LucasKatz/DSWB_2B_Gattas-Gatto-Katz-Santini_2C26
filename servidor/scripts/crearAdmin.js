import mongoose from "mongoose";
import { conectarDB } from "../config/db.js";
import Paciente from "../modelos/paciente.js";
import Kinesio from "../modelos/kinesio.js";
import Admin from "../modelos/admins.js";

const [nombre, emailEntrada, password] = process.argv.slice(2);

if (!nombre || !emailEntrada || !password) {
    console.error('Uso: npm run crear-admin -- "Nombre" correo@ejemplo.com contraseña');
    process.exit(1);
}

const email = emailEntrada.trim().toLowerCase();

try {
    await conectarDB();

    const existente =
        (await Paciente.findOne({ email })) ||
        (await Kinesio.findOne({ email })) ||
        (await Admin.findOne({ email }));

    if (existente) {
        console.error("El correo ya está registrado en la plataforma.");
        process.exitCode = 1;
    } else {
        await new Admin({ nombre, email, password, rol: "admin" }).save();
        console.log(`Administrador creado: ${email}`);
    }
} catch (error) {
    console.error(error.message);
    process.exitCode = 1;
} finally {
    await mongoose.disconnect();
}
