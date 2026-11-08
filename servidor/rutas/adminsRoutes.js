import express from "express";
import { verificarToken, soloAdmin } from "../middlewares/authMiddelware.js";
import { obtenerTodos, obtenerPorId, crear, actualizar, eliminar } from "../controladores/adminsControlador.js";

const router = express.Router();

router.use(verificarToken, soloAdmin);

router.get("/", obtenerTodos);
router.get("/:id", obtenerPorId);
router.post("/", crear);
router.put("/:id", actualizar);
router.delete("/:id", eliminar);

export default router;
