const fs = require("fs");
const path = require("path");

const Admins = require("../modelos/admins");
const rutaArchivo = path.join(__dirname, "../data/admins.json");

// Función leer archivo
const leerAdmins = () => {
    const data = fs.readFileSync(rutaArchivo, "utf-8");
    return JSON.parse(data);
};

// Función guardar archivo
const guardarAdmins = (admins) => {
    fs.writeFileSync(
        rutaArchivo,
        JSON.stringify(admins, null, 2)
    );
};

// GET ALL
const obtenerAdmins = (req, res) => {
    const admins = leerAdmins();
    res.json(admins);
};


const obtenerAdminPorId = (req, res) => {
    const admins = leerAdmins();
    const id = parseInt(req.params.id);

    const admin = admins.find(d => d.id === id);

    if (!admin) {
        return res.status(404).json({
            mensaje: "Administrador no encontrado"
        });
    }

    res.json(admin);
};

// CREATE
const crearAdmin = (req, res) => {
    const admins = leerDoctores();
    const { id, nombre, apellido, rol } = req.body;

    const nuevoAdmin = new Doctor(id, nombre, apellido, rol);
    doctores.push(nuevoAdmin);

    guardarDoctores(admins);

    res.status(201).json({
        mensaje: "Administrador registrado",
        admin: nuevoAdmin
    });
};

// UPDATE
const actualizarAdmin = (req, res) => {
    const admins = leerAdmins();
    const id = parseInt(req.params.id);

    const admin = admins.find(d => d.id === id);

    if (!admin) {
        return res.status(404).json({
            mensaje: "Administrador no encontrado"
        });
    }

    const { nombre, apellido, rol } = req.body;

    admin.nombre = nombre ?? admin.nombre;
    admin.apellido = apellido ?? admin.apellido;
    admin.rol = rol ?? admin.rol;

    guardarAdmins(admins);

    res.json({
        mensaje: "Administrador actualizado",
        admin
    });
};

// DELETE
const eliminarAdmin = (req, res) => {
    const admins = leerAdmins();
    const id = parseInt(req.params.id);

    const nuevosAdmins = admins.filter(d => d.id !== id);

    if (admins.length === nuevosAdmins.length) {
        return res.status(404).json({
            mensaje: "Administrador no encontrado"
        });
    }

    guardarAdmins(nuevosAdmins);

    res.json({
        mensaje: "Administrador eliminado"
    });
};

module.exports = {
    obtenerAdmins,
    obtenerAdminPorId,
    crearAdmin,
    actualizarAdmin,
    eliminarAdmin
};