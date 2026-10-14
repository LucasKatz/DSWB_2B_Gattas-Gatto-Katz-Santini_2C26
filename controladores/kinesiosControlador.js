const Kinesio = require("../modelos/kinesio");

// GET ALL
const obtenerKinesiologos = async (req, res, next) => {
    try {
        const kinesiologos = await Kinesio.find();
        res.json(kinesiologos);
    } catch (error) {
        next(error);
    }
};

// GET BY ID
const obtenerKinesiologoPorId = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const kinesiologo = await Kinesio.findOne({ id });

        if (!kinesiologo) {
            return res.status(404).json({ mensaje: "Kinesiologo no encontrado" });
        }

        res.json(kinesiologo);
    } catch (error) {
        next(error);
    }
};

// CREATE
const crearKinesiologo = async (req, res, next) => {
    try {
        const { id, nombre, apellido, especialidad, rol } = req.body;

        const nuevoKinesiologo = await Kinesio.create({
            id: parseInt(id),
            nombre,
            apellido,
            especialidad,
            rol: rol || "kinesiologo"
        });

        res.status(201).json({
            mensaje: "Kinesiologo registrado",
            kinesiologo: nuevoKinesiologo
        });
    } catch (error) {
        next(error);
    }
};

// UPDATE
const actualizarKinesiologo = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const { nombre, apellido, especialidad, rol } = req.body;

        const kinesiologoActualizado = await Kinesio.findOneAndUpdate(
            { id },
            { nombre, apellido, especialidad, rol },
            { new: true, runValidators: true }
        );

        if (!kinesiologoActualizado) {
            return res.status(404).json({ mensaje: "Kinesiologo no encontrado" });
        }

        res.json({
            mensaje: "Kinesiologo actualizado",
            kinesiologo: kinesiologoActualizado
        });
    } catch (error) {
        next(error);
    }
};

// DELETE
const eliminarKinesiologo = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const kinesiologoEliminado = await Kinesio.findOneAndDelete({ id });

        if (!kinesiologoEliminado) {
            return res.status(404).json({ mensaje: "Kinesiologo no encontrado" });
        }

        res.json({ mensaje: "Kinesiologo eliminado" });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    obtenerKinesiologos,
    obtenerKinesiologoPorId,
    crearKinesiologo,
    actualizarKinesiologo,
    eliminarKinesiologo
};