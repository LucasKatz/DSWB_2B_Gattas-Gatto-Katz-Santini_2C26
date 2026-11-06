"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardAdminPage() {
  const [pacientes, setPacientes] = useState([]);
  const [kinesiologos, setKinesiologos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [usuario, setUsuario] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStored = localStorage.getItem("usuario");

    if (!token) {
      router.push("/login");
      return;
    }

    if (userStored) {
      setUsuario(JSON.parse(userStored));
    }

    const obtenerDatos = async () => {
      try {
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

    const [resPacientes, resKinesios] = await Promise.all([
  fetch("/api/pacientes", { headers }),
  fetch("/api/kinesios", { headers }),
]);

        if (!resPacientes.ok || !resKinesios.ok) {
          throw new Error("No se pudieron obtener las listas de usuarios.");
        }

        const dataPacientes = await resPacientes.json();
        const dataKinesios = await resKinesios.json();

        setPacientes(Array.isArray(dataPacientes) ? dataPacientes : dataPacientes.pacientes || []);
        setKinesiologos(Array.isArray(dataKinesios) ? dataKinesios : dataKinesios.kinesiologos || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    obtenerDatos();
  }, [router]);

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    router.push("/login");
  };

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 font-medium">Cargando datos del panel...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between pb-6 mb-8 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Panel de Administración</h1>
          <p className="text-sm text-gray-600 mt-1">
            Gestión global de KineVida — Bienvenido, {usuario?.nombre || "Administrador"}
          </p>
        </div>
        <button
          onClick={cerrarSesion}
          className="mt-4 md:mt-0 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium shadow-sm transition-colors"
        >
          Cerrar Sesión
        </button>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto mb-6 bg-red-50 border-l-4 border-red-500 p-4 text-sm text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Columna Pacientes */}
        <section className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="w-3 h-3 bg-indigo-600 rounded-full font-inline-block"></span>
            Pacientes ({pacientes.length})
          </h2>
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {pacientes.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-6">No hay pacientes registrados.</p>
            ) : (
              pacientes.map((paciente) => (
                <div key={paciente._id} className="p-4 rounded-lg border border-gray-200 bg-gray-50/50">
                  <h3 className="font-semibold text-gray-900">{paciente.nombre}</h3>
                  <p className="text-sm text-gray-600">{paciente.email}</p>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Columna Kinesiólogos */}
        <section className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="w-3 h-3 bg-teal-500 rounded-full font-inline-block"></span>
            Kinesiólogos ({kinesiologos.length})
          </h2>
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {kinesiologos.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-6">No hay kinesiólogos registrados.</p>
            ) : (
              kinesiologos.map((kinesio) => (
                <div key={kinesio._id} className="p-4 rounded-lg border border-gray-200 bg-gray-50/50">
                  <h3 className="font-semibold text-gray-900">{kinesio.nombre}</h3>
                  <p className="text-sm text-gray-600">{kinesio.email}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}