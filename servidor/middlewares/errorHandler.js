const errorHandler = (err, req, res, next) => {
    if (err.name === "ValidationError") {
        const detalles = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({
            error: "Error de validación",
            mensaje: detalles.join(". "),
            detalles
        });
    }

    if (err.name === "CastError") {
        return res.status(400).json({
            error: "Identificador inválido",
            mensaje: "El identificador indicado no es válido."
        });
    }

    if (err.code === 11000) {
        return res.status(400).json({
            error: "Valor duplicado",
            mensaje: "Ya existe un registro con ese valor único (por ejemplo, el email)."
        });
    }

    if (err.type === "entity.parse.failed") {
        return res.status(400).json({
            error: "JSON inválido",
            mensaje: "El cuerpo de la solicitud no es un JSON válido."
        });
    }

    if (err.status >= 400 && err.status < 500) {
        return res.status(err.status).json({
            error: "Solicitud inválida",
            mensaje: "La solicitud no pudo procesarse."
        });
    }

    console.error(err.stack);

    res.status(500).json({
        error: "Error interno del servidor",
        mensaje: "Error interno del servidor"
    });
};

export default errorHandler;
