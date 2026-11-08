import Admin from "../modelos/admins.js";
import { crearCrud } from "./crudControlador.js";

export const { obtenerTodos, obtenerPorId, crear, actualizar, eliminar } =
    crearCrud(Admin, "Administrador", ["nombre"]);
