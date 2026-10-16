const Usuario = require("../modelos/usuarios"); // O la ruta a tu modelo

const iniciarSesion = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar el usuario por su email en MongoDB
        const usuario = await Usuario.findOne({ email });

        // Si no existe el usuario O la contraseña no es válida
        if (!usuario || usuario.password !== password) {
            return res.render("login", {
                error: "Email o password incorrectos"
            });
        }

        // Si las credenciales son correctas
        res.render("login", {
            mensajeExito: "Logueado con éxito"
        });
    } catch (error) {
        res.render("login", {
            error: "Ocurrió un error al iniciar sesión"
        });
    }
};

const registrarUsuario = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        if (!nombre || !email || !password) {
            return res.render("registro", {
                error: "Todos los campos son obligatorios"
            });
        }

        const usuarioExiste = await Usuario.findOne({ email });

        if (usuarioExiste) {
            return res.render("registro", {
                error: "Ese email ya esta registrado"
            });
        }

        // Crear el nuevo usuario
        const nuevoUsuario = new Usuario({ nombre, email, password });
        await nuevoUsuario.save();

        res.render("login", {
            mensaje: "Usuario registrado con éxito. Inicia sesión."
        });
    } catch (error) {
        res.render("registro", {
            error: "Error al registrar el usuario"
        });
    }
};

module.exports = {
    iniciarSesion,
    registrarUsuario
};