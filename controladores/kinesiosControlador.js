const fs = require("fs");
const path = require("path");

const Kinesiologo = require("../modelos/kinesio");
const rutaArchivo = path.join(__dirname, "../data/kinesiologos.json");

// Función leer archivo
const leerKinesiologos = () => {
    const data = fs.readFileSync(rutaArchivo, "utf-8");
    return JSON.parse(data);
};

// Función guardar archivo
const guardarKinesiologos = (kinesiologos) => {
    fs.writeFileSync(
        rutaArchivo,
        JSON.stringify(kinesiologos, null, 2)
    );
};

// GET ALL
const obtenerKinesiologos = (req, res) => {
    const kinesiologos = leerKinesiologos();
    res.json(kinesiologos);
};

// GET BY ID
const obtenerKinesiologoPorId = (req, res) => {
    const kinesiologos = leerKinesiologos();
    const id = parseInt(req.params.id);

    const kinesiologo = kinesiologos.find(d => d.id === id);

    if (!kinesiologo) {
        return res.status(404).json({
            mensaje: "Kinesiologo no encontrado"
        });
    }

    res.json(kinesiologo);
};

// CREATE
const crearKinesiologo = (req, res) => {
    const kinesiologos = leerKinesiologos();
    const { id, nombre, apellido, especialidad } = req.body;

    const nuevoKinesiologo = new Kinesiologo(id, nombre, apellido, especialidad);
    kinesiologos.push(nuevoKinesiologo);

    guardarKinesiologos(kinesiologos);

    res.status(201).json({
        mensaje: "Kinesiologo registrado",
        kinesiologo: nuevoKinesiologo
    });
};

// UPDATE
const actualizarKinesiologo = (req, res) => {
    const kinesiologos = leerKinesiologos();
    const id = parseInt(req.params.id);

    const kinesiologo = kinesiologos.find(d => d.id === id);

    if (!kinesiologo) {
        return res.status(404).json({
            mensaje: "Kinesiologo no encontrado"
        });
    }

    const { nombre, apellido, especialidad } = req.body;

    kinesiologo.nombre = nombre ?? kinesiologo.nombre;
    kinesiologo.apellido = apellido ?? kinesiologo.apellido;
    kinesiologo.especialidad = especialidad ?? kinesiologo.especialidad;

    guardarKinesiologos(kinesiologos);

    res.json({
        mensaje: "Kinesiologo actualizado",
        kinesiologo
    });
};

// DELETE
const eliminarKinesiologo = (req, res) => {
    const kinesiologos = leerKinesiologos();
    const id = parseInt(req.params.id);

    const nuevosKinesiologos = kinesiologos.filter(d => d.id !== id);

    if (kinesiologos.length === nuevosKinesiologos.length) {
        return res.status(404).json({
            mensaje: "Kinesiologo no encontrado"
        });
    }

    guardarKinesiologos(nuevosKinesiologos);

    res.json({
        mensaje: "Kinesiologo eliminado"
    });
};

module.exports = {
    obtenerKinesiologos,
    obtenerKinesiologoPorId,
    crearKinesiologo,
    actualizarKinesiologo,
    eliminarKinesiologo
};