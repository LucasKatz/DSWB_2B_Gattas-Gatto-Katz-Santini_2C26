import Paciente from "../modelos/paciente.js";
import { crearCrud } from "./crudControlador.js";

export const { obtenerTodos, obtenerPorId, crear, actualizar, eliminar } =
    crearCrud(Paciente, "Paciente", ["nombre"]);
