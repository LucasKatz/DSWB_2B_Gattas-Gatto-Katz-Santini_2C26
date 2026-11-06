import express from "express";
const router = express.Router();

// IMPORTANTE: Los nombres deben coincidir con los export del controlador
import {
    obtenerKinesiologos,
    obtenerKinesiologoPorId,
    crearKinesiologo,
    actualizarKinesiologo,
    eliminarKinesiologo
} from "../controladores/kinesiosControlador.js";

// Rutas CRUD
router.get("/", obtenerKinesiologos);
router.get("/:id", obtenerKinesiologoPorId);
router.post("/", crearKinesiologo);
router.put("/:id", actualizarKinesiologo);
router.delete("/:id", eliminarKinesiologo);

export default router;