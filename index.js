const express = require("express");
const conectarDB = require("./config/db");

// Modelos para la consulta del formulario Pug
const Paciente = require("./modelos/paciente");
const Kinesio = require("./modelos/kinesio");
const Admin = require("./modelos/admins");

const pacientesRoutes = require("./rutas/pacientesRoutes");
const kinesiosRoutes = require("./rutas/kinesiosRoutes");
const adminsRoutes = require("./rutas/adminsRoutes");
const authRoutes = require("./rutas/authRoutes"); 
const errorHandler = require("./middlewares/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar MongoDB
conectarDB();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Motor de plantillas Pug
app.set("view engine", "pug");
app.set("views", "./views");

// 1. Ruta principal
app.get("/", (req, res) => {
    res.render("form");
});

// 2. Ruta POST /respuesta (Adaptada a MongoDB con async/await)
app.post("/respuesta", async (req, res, next) => {
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
            return res.status(400).send("Tipo de usuario no válido.");
        }

        if (!usuarioEncontrado) {
            return res.status(404).send("Usuario no encontrado.");
        }

        res.render("respuesta", { usuario: usuarioEncontrado });
    } catch (error) {
        next(error);
    }
});

// 3. Rutas de autenticación (Login / Registro)
app.use("/", authRoutes); 

// Rutas API REST
app.use("/pacientes", pacientesRoutes);
app.use("/kinesios", kinesiosRoutes);
app.use("/admins", adminsRoutes);

// Middleware de gestión de errores 
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});