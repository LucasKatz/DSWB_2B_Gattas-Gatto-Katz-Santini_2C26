const CLAVE_TOKEN = "token";
const CLAVE_USUARIO = "usuario";

export function guardarSesion(token, usuario) {
  localStorage.setItem(CLAVE_TOKEN, token);
  localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
}

export function obtenerToken() {
  return localStorage.getItem(CLAVE_TOKEN);
}

export function obtenerUsuario() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_USUARIO));
  } catch {
    return null;
  }
}

export function cerrarSesion() {
  localStorage.removeItem(CLAVE_TOKEN);
  localStorage.removeItem(CLAVE_USUARIO);
  window.location.href = "/login";
}

export function rutaInicio(usuario) {
  return usuario && usuario.rol === "paciente" ? "/turnos" : "/dashboard";
}

export function exigirRol(rolesPermitidos) {
  const token = obtenerToken();
  const usuario = obtenerUsuario();

  if (!token || !usuario) {
    window.location.replace("/login");
    return null;
  }

  if (!rolesPermitidos.includes(usuario.rol)) {
    window.location.replace(rutaInicio(usuario));
    return null;
  }

  return usuario;
}

export async function peticion(ruta, opciones = {}) {
  const { metodo = "GET", cuerpo, autenticada = true } = opciones;
  const headers = { "Content-Type": "application/json" };
  const token = obtenerToken();

  if (autenticada && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let respuesta;
  try {
    respuesta = await fetch(ruta, {
      method: metodo,
      headers,
      body: cuerpo ? JSON.stringify(cuerpo) : undefined,
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor.");
  }

  let datos = {};
  try {
    datos = await respuesta.json();
  } catch {
    datos = {};
  }

  const sesionVencida =
    respuesta.status === 401 ||
    (respuesta.status === 403 && /token/i.test(datos.mensaje || ""));

  if (autenticada && token && sesionVencida) {
    cerrarSesion();
  }

  if (!respuesta.ok) {
    throw new Error(datos.mensaje || "Ocurrió un error en la solicitud.");
  }

  return datos;
}
