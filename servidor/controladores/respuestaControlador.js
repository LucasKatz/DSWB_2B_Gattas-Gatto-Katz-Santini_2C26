import { modelosPorColeccion } from "../utilidades/usuarios.js";

export const buscarUsuario = async (req, res, next) => {
    try {
        const { tipo, id } = req.body;

        if (typeof tipo !== "string" || !Object.hasOwn(modelosPorColeccion, tipo)) {
            return res.status(400).json({ mensaje: "El tipo debe ser pacientes, kinesios o admins." });
        }

        if (typeof id !== "string" || !id) {
            return res.status(400).json({ mensaje: "El id es obligatorio." });
        }

        const usuario = await modelosPorColeccion[tipo].findById(id).select("-password");
        if (!usuario) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        res.status(200).json({ usuario });
    } catch (error) {
        next(error);
    }
};
