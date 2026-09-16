const fs = require("fs");
const path = require("path");

const Paciente = require("../modelos/paciente");

const rutaArchivo = path.join(__dirname, "../data/pacientes.json");


// función leer archivo
const leerPacientes = () => {
    const data = fs.readFileSync(rutaArchivo, "utf-8");

    return JSON.parse(data);

};


// función guardar archivo
const guardarPacientes = (pacientes) => {

    fs.writeFileSync(
        rutaArchivo,
        JSON.stringify(pacientes, null, 2)
    );

};


// GET ALL
const obtenerPacientes = (req, res) => {

    const pacientes = leerPacientes();

    res.json(pacientes);

};


// GET BY ID
const obtenerPacientePorId = (req, res) => {

    const pacientes = leerPacientes();

    const id = parseInt(req.params.id);

    const paciente = pacientes.find(p => p.id === id);

    if (!paciente) {

        return res.status(404).json({
            mensaje: "Paciente no encontrado"
        });

    }

    res.json(paciente);

};


// CREATE
const crearPaciente = (req, res) => {

    const pacientes = leerPacientes();

    const { id, nombre, apellido } = req.body;

    const nuevoPaciente = new Persona(id, nombre, apellido);

    personas.push(nuevoPaciente);

    guardarPersonas(pacientes);

    res.status(201).json({
        mensaje: "Paciente Registrado",
        paciente: nuevoPaciente
    });

};


// UPDATE
const actualizarPaciente = (req, res) => {

    const personas = leerPersonas();

    const id = parseInt(req.params.id);

    const persona = personas.find(p => p.id === id);

    if (!persona) {

        return res.status(404).json({
            mensaje: "Persona no encontrada"
        });

    }

    const { nombre, apellido } = req.body;

    persona.nombre = nombre ?? persona.nombre;
    persona.apellido = apellido ?? persona.apellido;

    guardarPersonas(personas);

    res.json({
        mensaje: "Persona actualizada",
        persona
    });

};


// DELETE
const eliminarPaciente = (req, res) => {

    const personas = leerPersonas();

    const id = parseInt(req.params.id);

    const nuevasPersonas = personas.filter(p => p.id !== id);

    if (personas.length === nuevasPersonas.length) {

        return res.status(404).json({
            mensaje: "Persona no encontrada"
        });

    }

    guardarPacientes(nuevosPacientes);

    res.json({
        mensaje: "Paciente eliminado"
    });

};


module.exports = {

    obtenerPacientes,
    obtenerPacientePorId,
    crearPaciente,
    actualizarPaciente,
    eliminarPaciente

};