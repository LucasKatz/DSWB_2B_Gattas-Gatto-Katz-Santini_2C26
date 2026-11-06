import express from "express";

const router = express.Router();

import {

    obtenerPacientes,
    obtenerPacientePorId,
    crearPaciente,
    actualizarPaciente,
    eliminarPaciente

} from "../controladores/pacientesControlador.js";


// rutas CRUD

router.get("/", obtenerPacientes);

router.get("/:id", obtenerPacientePorId);

router.post("/", crearPaciente);

router.put("/:id", actualizarPaciente);

router.delete("/:id", eliminarPaciente);


export default router;