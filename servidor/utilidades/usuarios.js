import Paciente from "../modelos/paciente.js";
import Kinesio from "../modelos/kinesio.js";
import Admin from "../modelos/admins.js";

export const modelosPorRol = {
    paciente: Paciente,
    kinesio: Kinesio,
    admin: Admin
};

export const modelosPorColeccion = {
    pacientes: Paciente,
    kinesios: Kinesio,
    admins: Admin
};

export const texto = (valor) => (typeof valor === "string" ? valor.trim() : "");

export const emailEnUso = async (email, excluirId) => {
    const resultados = await Promise.all(
        Object.values(modelosPorRol).map((Modelo) => Modelo.exists({ email }))
    );
    return resultados.some((doc) => doc && String(doc._id) !== String(excluirId));
};
