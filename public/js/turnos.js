import { exigirRol, cerrarSesion } from "./sesion.js";

const usuario = exigirRol(["paciente"]);

if (usuario) {
  document.getElementById("contenido").hidden = false;
  document.getElementById("saludo").textContent = `Hola, ${usuario.nombre}`;
  document.getElementById("salir").addEventListener("click", cerrarSesion);
}
