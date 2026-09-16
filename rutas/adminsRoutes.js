const express = require("express");
const router = express.Router();

const {
    obtenerAdmins,
    obtenerAdminPorId,
    crearAdmin,
    actualizarAdmin,
    eliminarAdmin
} = require("../controladores/adminsControlador");

// rutas CRUD
router.get("/", obtenerAdmins);
router.get("/:id", obtenerAdminPorId);
router.post("/", crearAdmin);
router.put("/:id", actualizarAdmin);
router.delete("/:id", eliminarAdmin);

module.exports = router;