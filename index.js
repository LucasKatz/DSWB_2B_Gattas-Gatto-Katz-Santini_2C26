const express = require("express");
const fs = require("fs");
const path = require("path");

const pacientesRoutes = require("./rutas/pacientesRoutes");
const kinesiosRoutes = require("./rutas/kinesiosRoutes");
const adminsRoutes = require("./rutas/adminsRoutes");

const app = express();
const PORT = 3000;

// Middlewares para procesar JSON y formularios HTML
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de motor de plantillas
app.set("view engine", "pug");
app.set("views", "./views");

// 1. Ruta principal GET "/" (Muestra la plantilla form.pug)
app.get("/", (req, res) => {
    res.render("form");
});

// 2. Ruta POST "/respuesta" (Procesa la información del formulario)
app.post("/respuesta", (req, res) => {
    const { tipo, id } = req.body;

    // Busca en la carpeta data según la opción elegida (pacientes, doctores, admins)
    const rutaArchivo = path.join(__dirname, `./data/${tipo}.json`);

    if (!fs.existsSync(rutaArchivo)) {
        return res.status(404).send("El tipo de usuario seleccionado no existe.");
    }

    const usuarios = JSON.parse(fs.readFileSync(rutaArchivo, "utf-8"));
    const usuarioEncontrado = usuarios.find(u => u.id === parseInt(id));

    if (!usuarioEncontrado) {
        return res.status(404).send("Usuario no encontrado.");
    }

    // Renderiza la plantilla respuesta.pug pasándole el objeto usuario
    res.render("respuesta", {
        usuario: usuarioEncontrado
    });
});

// Rutas de las API REST (para probar endpoints en Thunder Client)
app.use("/pacientes", pacientesRoutes);
app.use("/kinesios", kinesiosRoutes);
app.use("/admins", adminsRoutes);

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});