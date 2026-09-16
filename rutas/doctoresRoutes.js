const express = require("express");
const router = express.Router();

const {
    obtenerDoctores,
    obtenerDoctorPorId,
    crearDoctor,
    actualizarDoctor,
    eliminarDoctor
} = require("../controladores/doctoresControlador");

// rutas CRUD
router.get("/", obtenerDoctores);
router.get("/:id", obtenerDoctorPorId);
router.post("/", crearDoctor);
router.put("/:id", actualizarDoctor);
router.delete("/:id", eliminarDoctor);

module.exports = router;