import Kinesio from "../modelos/kinesio.js";
import { crearCrud } from "./crudControlador.js";

export const { obtenerTodos, obtenerPorId, crear, actualizar, eliminar } =
    crearCrud(Kinesio, "Kinesiólogo", ["nombre", "especialidad"]);
