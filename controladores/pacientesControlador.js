const Paciente = require("../modelos/paciente");

// GET ALL
const obtenerPacientes = async (req, res, next) => {
    try {
        const pacientes = await Paciente.find();
        res.json(pacientes);
    } catch (error) {
        next(error);
    }
};

// GET BY ID
const obtenerPacientePorId = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const paciente = await Paciente.findOne({ id });

        if (!paciente) {
            return res.status(404).json({ mensaje: "Paciente no encontrado" });
        }

        res.json(paciente);
    } catch (error) {
        next(error);
    }
};

// CREATE
const crearPaciente = async (req, res, next) => {
    try {
        const { id, nombre, apellido, rol } = req.body;

        const nuevoPaciente = await Paciente.create({
            id: parseInt(id),
            nombre,
            apellido,
            rol: rol || "paciente"
        });

        res.status(201).json({
            mensaje: "Paciente registrado",
            paciente: nuevoPaciente
        });
    } catch (error) {
        next(error);
    }
};

// UPDATE
const actualizarPaciente = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const { nombre, apellido, rol } = req.body;

        const pacienteActualizado = await Paciente.findOneAndUpdate(
            { id },
            { nombre, apellido, rol },
            { new: true, runValidators: true } // Returna el objeto actualizado y ejecuta las validaciones
        );

        if (!pacienteActualizado) {
            return res.status(404).json({ mensaje: "Paciente no encontrado" });
        }

        res.json({
            mensaje: "Paciente actualizado",
            paciente: pacienteActualizado
        });
    } catch (error) {
        next(error);
    }
};

// DELETE
const eliminarPaciente = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const pacienteEliminado = await Paciente.findOneAndDelete({ id });

        if (!pacienteEliminado) {
            return res.status(404).json({ mensaje: "Paciente no encontrado" });
        }

        res.json({ mensaje: "Paciente eliminado" });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    obtenerPacientes,
    obtenerPacientePorId,
    crearPaciente,
    actualizarPaciente,
    eliminarPaciente
};