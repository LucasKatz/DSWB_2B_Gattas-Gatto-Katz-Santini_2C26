import { peticion, guardarSesion, rutaInicio } from "./sesion.js";

const formulario = document.getElementById("formulario");
const alerta = document.getElementById("alerta");
const boton = document.getElementById("boton");

formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  alerta.hidden = true;
  boton.disabled = true;
  boton.textContent = "Ingresando...";

  try {
    const datos = await peticion("/api/auth/login", {
      metodo: "POST",
      autenticada: false,
      cuerpo: {
        email: formulario.elements.email.value,
        password: formulario.elements.password.value,
      },
    });

    guardarSesion(datos.token, datos.usuario);
    window.location.href = rutaInicio(datos.usuario);
  } catch (error) {
    alerta.textContent = error.message;
    alerta.hidden = false;
    boton.disabled = false;
    boton.textContent = "Iniciar sesión";
  }
});
