// servidor/app.js
// Crea y exporta la aplicación Express de KineVida (API REST).
// No llama a app.listen(): en Vercel la ejecuta Next.js a través de
// pages/api/[[...ruta]].js, y en local la levanta servidor/index.js.
import express from "express";
import cors from "cors";
import { conectarDB } from "./config/db.js";

// Modelos
import Paciente from "./modelos/paciente.js";
import Kinesio from "./modelos/kinesio.js";
import Admin from "./modelos/admins.js";

// Rutas
import pacientesRoutes from "./rutas/pacientesRoutes.js";
import kinesiosRoutes from "./rutas/kinesiosRoutes.js";
import adminsRoutes from "./rutas/adminsRoutes.js";
import authRoutes from "./rutas/authRoutes.js";

import errorHandler from "./middlewares/errorHandler.js";

const app = express();

// Middlewares generales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas básicas de verificación ("/" en modo local, "/api" en Vercel)
app.get(["/", "/api"], (req, res) => {
    res.json({ mensaje: "API REST KineVida ejecutándose correctamente" });
});

// Conexión a MongoDB Atlas (cacheada: se reutiliza entre peticiones)
app.use(async (req, res, next) => {
    try {
        await conectarDB();
        next();
    } catch (error) {
        next(error);
    }
});

app.post(["/respuesta", "/api/respuesta"], async (req, res, next) => {
    try {
        const { tipo, id } = req.body;
        let usuarioEncontrado = null;
        const numId = parseInt(id);

        if (tipo === "pacientes") {
            usuarioEncontrado = await Paciente.findOne({ id: numId });
        } else if (tipo === "kinesios") {
            usuarioEncontrado = await Kinesio.findOne({ id: numId });
        } else if (tipo === "admins") {
            usuarioEncontrado = await Admin.findOne({ id: numId });
        } else {
            return res.status(400).json({ error: "Tipo de usuario no válido." });
        }

        if (!usuarioEncontrado) {
            return res.status(404).json({ error: "Usuario no encontrado." });
        }

        res.status(200).json({ usuario: usuarioEncontrado });
    } catch (error) {
        next(error);
    }
});

// Rutas principales de la API
app.use("/api/auth", authRoutes);
app.use("/api/pacientes", pacientesRoutes);
app.use("/api/kinesios", kinesiosRoutes);
app.use("/api/admins", adminsRoutes);

// Manejo de rutas no encontradas (404 en JSON)
app.use((req, res) => {
    res.status(404).json({ mensaje: "Ruta no encontrada en la API" });
});

// Middleware global de errores
app.use(errorHandler);

export default app;
