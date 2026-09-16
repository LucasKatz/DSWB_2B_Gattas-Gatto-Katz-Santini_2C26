const express = require("express");
const router = express.Router();

// IMPORTANTE: Los nombres deben coincidir con module.exports del controlador
const {
    obtenerKinesiologos,
    obtenerKinesiologoPorId,
    crearKinesiologo,
    actualizarKinesiologo,
    eliminarKinesiologo
} = require("../controladores/kinesiosControlador");

// Rutas CRUD
router.get("/", obtenerKinesiologos);
router.get("/:id", obtenerKinesiologoPorId);
router.post("/", crearKinesiologo);
router.put("/:id", actualizarKinesiologo);
router.delete("/:id", eliminarKinesiologo);

module.exports = router;