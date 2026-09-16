const fs = require("fs");
const path = require("path");

const Doctor = require("../modelos/doctor");
const rutaArchivo = path.join(__dirname, "../data/doctores.json");

// Función leer archivo
const leerDoctores = () => {
    const data = fs.readFileSync(rutaArchivo, "utf-8");
    return JSON.parse(data);
};

// Función guardar archivo
const guardarDoctores = (doctores) => {
    fs.writeFileSync(
        rutaArchivo,
        JSON.stringify(doctores, null, 2)
    );
};

// GET ALL
const obtenerDoctores = (req, res) => {
    const doctores = leerDoctores();
    res.json(doctores);
};

// GET BY ID
const obtenerDoctorPorId = (req, res) => {
    const doctores = leerDoctores();
    const id = parseInt(req.params.id);

    const doctor = doctores.find(d => d.id === id);

    if (!doctor) {
        return res.status(404).json({
            mensaje: "Doctor no encontrado"
        });
    }

    res.json(doctor);
};

// CREATE
const crearDoctor = (req, res) => {
    const doctores = leerDoctores();
    const { id, nombre, apellido, especialidad } = req.body;

    const nuevoDoctor = new Doctor(id, nombre, apellido, especialidad);
    doctores.push(nuevoDoctor);

    guardarDoctores(doctores);

    res.status(201).json({
        mensaje: "Doctor registrado",
        doctor: nuevoDoctor
    });
};

// UPDATE
const actualizarDoctor = (req, res) => {
    const doctores = leerDoctores();
    const id = parseInt(req.params.id);

    const doctor = doctores.find(d => d.id === id);

    if (!doctor) {
        return res.status(404).json({
            mensaje: "Doctor no encontrado"
        });
    }

    const { nombre, apellido, especialidad } = req.body;

    doctor.nombre = nombre ?? doctor.nombre;
    doctor.apellido = apellido ?? doctor.apellido;
    doctor.especialidad = especialidad ?? doctor.especialidad;

    guardarDoctores(doctores);

    res.json({
        mensaje: "Doctor actualizado",
        doctor
    });
};

// DELETE
const eliminarDoctor = (req, res) => {
    const doctores = leerDoctores();
    const id = parseInt(req.params.id);

    const nuevosDoctores = doctores.filter(d => d.id !== id);

    if (doctores.length === nuevosDoctores.length) {
        return res.status(404).json({
            mensaje: "Doctor no encontrado"
        });
    }

    guardarDoctores(nuevosDoctores);

    res.json({
        mensaje: "Doctor eliminado"
    });
};

module.exports = {
    obtenerDoctores,
    obtenerDoctorPorId,
    crearDoctor,
    actualizarDoctor,
    eliminarDoctor
};