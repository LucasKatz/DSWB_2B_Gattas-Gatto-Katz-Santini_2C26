import { exigirRol, peticion } from "./sesion.js";

const usuario = exigirRol(["admin"]);

if (usuario) {
  const contenido = document.getElementById("contenido");
  const formulario = document.getElementById("formulario");
  const alerta = document.getElementById("alerta");
  const boton = document.getElementById("boton");

  contenido.hidden = false;

  formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    alerta.hidden = true;
    boton.disabled = true;
    boton.textContent = "Registrando...";

    try {
      const datos = await peticion("/api/auth/registro", {
        metodo: "POST",
        cuerpo: {
          nombre: formulario.elements.nombre.value,
          email: formulario.elements.email.value,
          password: formulario.elements.password.value,
          rol: formulario.elements.rol.value,
        },
      });

      alerta.className = "alerta alerta-ok";
      alerta.textContent = datos.mensaje;
      formulario.reset();
    } catch (error) {
      alerta.className = "alerta alerta-error";
      alerta.textContent = error.message;
    } finally {
      alerta.hidden = false;
      boton.disabled = false;
      boton.textContent = "Registrar usuario";
    }
  });
}
