import express from "express";
import cors from "cors";
import { fileURLToPath } from "node:url";
import { conectarDB } from "./config/db.js";
import authRoutes from "./rutas/authRoutes.js";
import pacientesRoutes from "./rutas/pacientesRoutes.js";
import kinesiosRoutes from "./rutas/kinesiosRoutes.js";
import adminsRoutes from "./rutas/adminsRoutes.js";
import respuestaRoutes from "./rutas/respuestaRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();
const carpetaPublica = fileURLToPath(new URL("../public", import.meta.url));

app.disable("x-powered-by");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(carpetaPublica, { extensions: ["html"] }));

app.get("/api", (req, res) => {
    res.json({ mensaje: "API REST KineVida ejecutándose correctamente" });
});

app.use("/api", async (req, res, next) => {
    try {
        await conectarDB();
        next();
    } catch (error) {
        next(error);
    }
});

app.use("/api/auth", authRoutes);
app.use("/api/pacientes", pacientesRoutes);
app.use("/api/kinesios", kinesiosRoutes);
app.use("/api/admins", adminsRoutes);
app.use("/api/respuesta", respuestaRoutes);

app.use("/api", (req, res) => {
    res.status(404).json({ mensaje: "Ruta no encontrada en la API" });
});

app.use((req, res) => {
    res.status(404).send("Página no encontrada");
});

app.use(errorHandler);

export default app;
