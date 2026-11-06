// Middleware para capturar errores globales en Express
// Se incluye "mensaje" en cada respuesta porque el frontend (login/registro)
// muestra data.mensaje cuando la API responde con error.
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    // Error de validación de Mongoose
    if (err.name === "ValidationError") {
        const detalles = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({
            error: "Error de validación",
            mensaje: detalles.join(". "),
            detalles
        });
    }

    // Error de clave duplicada (ej: ID o email repetido)
    if (err.code === 11000) {
        return res.status(400).json({
            error: "El ID ingresado ya existe en la base de datos.",
            mensaje: "El ID ingresado ya existe en la base de datos."
        });
    }

    res.status(500).json({
        error: "Error interno del servidor",
        mensaje: "Error interno del servidor"
    });
};

export default errorHandler;
