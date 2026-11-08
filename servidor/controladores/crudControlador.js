import { emailEnUso, texto } from "../utilidades/usuarios.js";

const sinPassword = (documento) => {
    const objeto = documento.toObject();
    delete objeto.password;
    return objeto;
};

const passwordDe = (valor) => (typeof valor === "string" ? valor : "");

export const crearCrud = (Modelo, etiqueta, camposEditables) => ({
    obtenerTodos: async (req, res, next) => {
        try {
            const documentos = await Modelo.find().select("-password");
            res.status(200).json(documentos);
        } catch (error) {
            next(error);
        }
    },

    obtenerPorId: async (req, res, next) => {
        try {
            const documento = await Modelo.findById(req.params.id).select("-password");
            if (!documento) {
                return res.status(404).json({ mensaje: `${etiqueta} no encontrado` });
            }
            res.status(200).json(documento);
        } catch (error) {
            next(error);
        }
    },

    crear: async (req, res, next) => {
        try {
            const email = texto(req.body.email).toLowerCase();
            const password = passwordDe(req.body.password);

            if (!texto(req.body.nombre) || !email || !password) {
                return res.status(400).json({ mensaje: "Nombre, email y contraseña son obligatorios." });
            }

            if (password.length < 6) {
                return res.status(400).json({ mensaje: "La contraseña debe tener al menos 6 caracteres." });
            }

            if (await emailEnUso(email)) {
                return res.status(400).json({ mensaje: "El correo ya está registrado en la plataforma." });
            }

            const datos = { email, password };
            for (const campo of camposEditables) {
                if (req.body[campo] !== undefined) {
                    datos[campo] = req.body[campo];
                }
            }

            const documento = new Modelo(datos);
            await documento.save();

            res.status(201).json({ mensaje: `${etiqueta} creado con éxito`, usuario: sinPassword(documento) });
        } catch (error) {
            next(error);
        }
    },

    actualizar: async (req, res, next) => {
        try {
            const documento = await Modelo.findById(req.params.id);
            if (!documento) {
                return res.status(404).json({ mensaje: `${etiqueta} no encontrado` });
            }

            for (const campo of camposEditables) {
                if (req.body[campo] !== undefined) {
                    documento[campo] = req.body[campo];
                }
            }

            if (req.body.email !== undefined) {
                const email = texto(req.body.email).toLowerCase();
                if (!email) {
                    return res.status(400).json({ mensaje: "El email no puede estar vacío." });
                }
                if (email !== documento.email && await emailEnUso(email, documento._id)) {
                    return res.status(400).json({ mensaje: "El correo ya está registrado en la plataforma." });
                }
                documento.email = email;
            }

            if (req.body.password !== undefined) {
                const password = passwordDe(req.body.password);
                if (password.length < 6) {
                    return res.status(400).json({ mensaje: "La contraseña debe tener al menos 6 caracteres." });
                }
                documento.password = password;
            }

            await documento.save();

            res.status(200).json({ mensaje: `${etiqueta} actualizado con éxito`, usuario: sinPassword(documento) });
        } catch (error) {
            next(error);
        }
    },

    eliminar: async (req, res, next) => {
        try {
            if (String(req.usuario?.id) === req.params.id) {
                return res.status(400).json({ mensaje: "No puede eliminar su propia cuenta." });
            }

            const documento = await Modelo.findByIdAndDelete(req.params.id);
            if (!documento) {
                return res.status(404).json({ mensaje: `${etiqueta} no encontrado` });
            }

            res.status(200).json({ mensaje: `${etiqueta} eliminado con éxito` });
        } catch (error) {
            next(error);
        }
    }
});
