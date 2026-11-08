import { exigirRol, peticion, cerrarSesion } from "./sesion.js";

const usuario = exigirRol(["admin", "kinesio"]);

function pintar(idLista, idContador, elementos, detalle) {
  const lista = document.getElementById(idLista);
  document.getElementById(idContador).textContent = elementos.length;
  lista.replaceChildren();

  if (elementos.length === 0) {
    const vacio = document.createElement("p");
    vacio.className = "vacio";
    vacio.textContent = "No hay registros.";
    lista.appendChild(vacio);
    return;
  }

  for (const elemento of elementos) {
    const fila = document.createElement("div");
    fila.className = "item";

    const nombre = document.createElement("strong");
    nombre.textContent = elemento.nombre;
    fila.appendChild(nombre);

    const email = document.createElement("span");
    email.textContent = elemento.email;
    fila.appendChild(email);

    if (detalle && elemento[detalle]) {
      const extra = document.createElement("span");
      extra.textContent = elemento[detalle];
      fila.appendChild(extra);
    }

    lista.appendChild(fila);
  }
}

async function iniciar() {
  const alerta = document.getElementById("alerta");

  document.getElementById("contenido").hidden = false;
  document.getElementById("saludo").textContent = `Bienvenido, ${usuario.nombre}`;
  document.getElementById("salir").addEventListener("click", cerrarSesion);

  if (usuario.rol === "admin") {
    document.getElementById("enlace-registro").hidden = false;
  }

  try {
    const [pacientes, kinesios] = await Promise.all([
      peticion("/api/pacientes"),
      peticion("/api/kinesios"),
    ]);

    pintar("lista-pacientes", "contador-pacientes", pacientes);
    pintar("lista-kinesios", "contador-kinesios", kinesios, "especialidad");
  } catch (error) {
    alerta.textContent = error.message;
    alerta.hidden = false;
  }
}

if (usuario) {
  iniciar();
}
