import express from "express";
import { verificarToken, soloAdmin } from "../middlewares/authMiddelware.js";
import { buscarUsuario } from "../controladores/respuestaControlador.js";

const router = express.Router();

router.post("/", verificarToken, soloAdmin, buscarUsuario);

export default router;
