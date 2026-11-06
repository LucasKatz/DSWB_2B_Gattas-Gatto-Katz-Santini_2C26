import express from "express";
const router = express.Router();
import { iniciarSesion, registrarUsuario } from "../controladores/authControlador.js";

// Ruta de API para registrar usuarios (POST http://localhost:3000/api/auth/registro)
router.post("/registro", registrarUsuario);

// Ruta de API para login (POST http://localhost:3000/api/auth/login)
router.post("/login", iniciarSesion);

export default router;