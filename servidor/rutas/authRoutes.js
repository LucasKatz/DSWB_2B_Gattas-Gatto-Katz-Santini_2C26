import express from "express";
import { iniciarSesion, registrarUsuario } from "../controladores/authControlador.js";
import { verificarToken, soloAdmin } from "../middlewares/authMiddelware.js";

const router = express.Router();

router.post("/registro", verificarToken, soloAdmin, registrarUsuario);
router.post("/login", iniciarSesion);

export default router;
