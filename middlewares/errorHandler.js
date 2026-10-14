// Middleware para capturar errores globales en Express
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    // Error de validación de Mongoose
    if (err.name === "ValidationError") {
        return res.status(400).json({
            error: "Error de validación",
            detalles: Object.values(err.errors).map(e => e.message)
        });
    }

    // Error de clave duplicada (ej: ID repetido)
    if (err.code === 11000) {
        return res.status(400).json({
            error: "El ID ingresado ya existe en la base de datos."
        });
    }

    res.status(500).json({ error: "Error interno del servidor" });
};

module.exports = errorHandler;