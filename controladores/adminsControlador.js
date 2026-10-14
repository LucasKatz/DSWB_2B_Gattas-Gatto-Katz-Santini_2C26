const Admin = require("../modelos/admins");

// GET ALL
const obtenerAdmins = async (req, res, next) => {
    try {
        const admins = await Admin.find();
        res.json(admins);
    } catch (error) {
        next(error);
    }
};

// GET BY ID
const obtenerAdminPorId = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const admin = await Admin.findOne({ id });

        if (!admin) {
            return res.status(404).json({ mensaje: "Administrador no encontrado" });
        }

        res.json(admin);
    } catch (error) {
        next(error);
    }
};

// CREATE
const crearAdmin = async (req, res, next) => {
    try {
        const { id, nombre, apellido, rol } = req.body;

        const nuevoAdmin = await Admin.create({
            id: parseInt(id),
            nombre,
            apellido,
            rol: rol || "admin"
        });

        res.status(201).json({
            mensaje: "Administrador registrado",
            admin: nuevoAdmin
        });
    } catch (error) {
        next(error);
    }
};

// UPDATE
const actualizarAdmin = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const { nombre, apellido, rol } = req.body;

        const adminActualizado = await Admin.findOneAndUpdate(
            { id },
            { nombre, apellido, rol },
            { new: true, runValidators: true }
        );

        if (!adminActualizado) {
            return res.status(404).json({ mensaje: "Administrador no encontrado" });
        }

        res.json({
            mensaje: "Administrador actualizado",
            admin: adminActualizado
        });
    } catch (error) {
        next(error);
    }
};

// DELETE
const eliminarAdmin = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const adminEliminado = await Admin.findOneAndDelete({ id });

        if (!adminEliminado) {
            return res.status(404).json({ mensaje: "Administrador no encontrado" });
        }

        res.json({ mensaje: "Administrador eliminado" });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    obtenerAdmins,
    obtenerAdminPorId,
    crearAdmin,
    actualizarAdmin,
    eliminarAdmin
};