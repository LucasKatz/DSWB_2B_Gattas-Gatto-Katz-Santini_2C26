import jwt from "jsonwebtoken";
import Paciente from "../modelos/paciente.js";
import Kinesio from "../modelos/kinesio.js";
import Admin from "../modelos/admins.js";
import { modelosPorRol, emailEnUso, texto } from "../utilidades/usuarios.js";

const registrarUsuario = async (req, res, next) => {
  try {
    const nombre = texto(req.body.nombre);
    const email = texto(req.body.email).toLowerCase();
    const password = typeof req.body.password === "string" ? req.body.password : "";
    const { rol } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ mensaje: "Nombre, email y contraseña son obligatorios." });
    }

    if (password.length < 6) {
      return res.status(400).json({ mensaje: "La contraseña debe tener al menos 6 caracteres." });
    }

    if (typeof rol !== "string" || !Object.hasOwn(modelosPorRol, rol)) {
      return res.status(400).json({ mensaje: "El rol especificado no es válido." });
    }

    if (await emailEnUso(email)) {
      return res.status(400).json({ mensaje: "El correo ya está registrado en la plataforma." });
    }

    const Modelo = modelosPorRol[rol];
    await new Modelo({ nombre, email, password, rol }).save();

    return res.status(201).json({
      mensaje: `Usuario registrado con éxito como ${rol}`
    });
  } catch (error) {
    next(error);
  }
};

const iniciarSesion = async (req, res, next) => {
  try {
    const email = texto(req.body.email).toLowerCase();
    const password = typeof req.body.password === "string" ? req.body.password : "";

    if (!email || !password) {
      return res.status(400).json({ mensaje: "Email y contraseña son obligatorios." });
    }

    const usuario = (await Paciente.findOne({ email })) ||
                    (await Kinesio.findOne({ email })) ||
                    (await Admin.findOne({ email }));

    if (!usuario || !(await usuario.validarPassword(password))) {
      return res.status(401).json({ mensaje: "Credenciales inválidas" });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET no está definida en las variables de entorno.");
    }

    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    return res.status(200).json({
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    next(error);
  }
};

export { registrarUsuario, iniciarSesion };
