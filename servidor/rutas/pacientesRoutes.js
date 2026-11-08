import express from "express";
import { verificarToken, permitirRoles, soloAdmin } from "../middlewares/authMiddelware.js";
import { obtenerTodos, obtenerPorId, crear, actualizar, eliminar } from "../controladores/pacientesControlador.js";

const router = express.Router();
const lectura = permitirRoles("admin", "kinesio");

router.use(verificarToken);

router.get("/", lectura, obtenerTodos);
router.get("/:id", lectura, obtenerPorId);
router.post("/", soloAdmin, crear);
router.put("/:id", soloAdmin, actualizar);
router.delete("/:id", soloAdmin, eliminar);

export default router;
