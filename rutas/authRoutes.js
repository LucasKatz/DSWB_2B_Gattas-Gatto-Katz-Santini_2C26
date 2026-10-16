const express = require("express");
const router = express.Router();
const { iniciarSesion, registrarUsuario } = require("../controladores/authControlador");

// Renderizar formulario de login
router.get("/login", (req, res) => {
    res.render("login");
});

// Procesar formulario de login
router.post("/login", iniciarSesion);

// Renderizar formulario de registro
router.get("/registro", (req, res) => {
    res.render("registro");
});

// Procesar formulario de registro
router.post("/registro", registrarUsuario);

module.exports = router;