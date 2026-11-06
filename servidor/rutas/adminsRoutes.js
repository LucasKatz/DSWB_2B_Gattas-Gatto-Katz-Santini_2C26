import express from "express";
const router = express.Router();

import {
    obtenerAdmins,
    obtenerAdminPorId,
    crearAdmin,
    actualizarAdmin,
    eliminarAdmin
} from "../controladores/adminsControlador.js";

// rutas CRUD
router.get("/", obtenerAdmins);
router.get("/:id", obtenerAdminPorId);
router.post("/", crearAdmin);
router.put("/:id", actualizarAdmin);
router.delete("/:id", eliminarAdmin);

export default router;