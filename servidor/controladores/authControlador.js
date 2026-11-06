import jwt from "jsonwebtoken";

// Importación de los modelos para enrutamiento por colección
import Paciente from "../modelos/paciente.js";
import Kinesio from "../modelos/kinesio.js";
import Admin from "../modelos/admins.js";

// Registrar Usuario (POST /api/auth/registro)
const registrarUsuario = async (req, res, next) => {
  try {
    const { nombre, email, password, rol } = req.body;

    // 1. Verificar si el email ya existe en alguna de las 3 colecciones
    const [existePaciente, existeKinesio, existeAdmin] = await Promise.all([
      Paciente.findOne({ email }),
      Kinesio.findOne({ email }),
      Admin.findOne({ email })
    ]);

    if (existePaciente || existeKinesio || existeAdmin) {
      return res.status(400).json({ mensaje: "El correo ya está registrado en la plataforma." });
    }

    // 2. Determinar en qué colección guardar según el rol
    let nuevoUsuario;

    if (rol === "paciente") {
      nuevoUsuario = new Paciente({ nombre, email, password, rol });
    } else if (rol === "kinesio") {
      nuevoUsuario = new Kinesio({ nombre, email, password, rol });
    } else if (rol === "admin") {
      nuevoUsuario = new Admin({ nombre, email, password, rol });
    } else {
      return res.status(400).json({ mensaje: "El rol especificado no es válido." });
    }

    // 3. Guardar en la base de datos
    await nuevoUsuario.save();

    return res.status(201).json({
      mensaje: `Usuario registrado con éxito como ${rol}`
    });

  } catch (error) {
    next(error);
  }
};

// Iniciar Sesión (POST /api/auth/login)
const iniciarSesion = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Buscar el usuario en las 3 colecciones
    let usuario = await Paciente.findOne({ email }) || 
                  await Kinesio.findOne({ email }) || 
                  await Admin.findOne({ email });

    if (!usuario || !(await usuario.validarPassword(password))) {
      return res.status(401).json({ mensaje: "Credenciales inválidas" });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET no está definida en las variables de entorno.");
    }

    // Generar Token JWT
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