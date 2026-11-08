import { obtenerToken, obtenerUsuario, rutaInicio } from "./sesion.js";

const usuario = obtenerUsuario();
const destino = obtenerToken() && usuario ? rutaInicio(usuario) : "/login";

window.location.replace(destino);
