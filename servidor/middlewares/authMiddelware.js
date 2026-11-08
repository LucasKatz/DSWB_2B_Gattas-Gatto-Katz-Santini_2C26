import jwt from "jsonwebtoken";

const verificarToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ mensaje: "Acceso denegado: No se proporcionó Token" });
    }

    if (!process.env.JWT_SECRET) {
        return next(new Error("JWT_SECRET no está definida en las variables de entorno."));
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });
        req.usuario = decoded;
        next();
    } catch (error) {
        res.status(403).json({ mensaje: "Token inválido o expirado" });
    }
};

const permitirRoles = (...roles) => (req, res, next) => {
    if (!req.usuario || !roles.includes(req.usuario.rol)) {
        return res.status(403).json({ mensaje: "Acceso denegado: su rol no tiene permiso para esta operación" });
    }
    next();
};

const soloAdmin = (req, res, next) => {
    if (!req.usuario || req.usuario.rol !== "admin") {
        return res.status(403).json({ mensaje: "Acceso denegado: se requiere rol de administrador" });
    }
    next();
};

export { verificarToken, permitirRoles, soloAdmin };
