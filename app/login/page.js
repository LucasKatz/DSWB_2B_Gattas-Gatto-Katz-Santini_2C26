"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
   const res = await fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});

      const data = await res.json();
      if (!res.ok) throw new Error(data.mensaje || "Error al iniciar sesión");

      // Guardar sesión en el almacenamiento local
      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-teal-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border border-teal-100">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-teal-800">Clínica KineVida</h1>
          <p className="text-sm text-teal-600">Portal de Gestión Kinesiológica</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Profesional</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full p-2 border border-teal-200 rounded focus:ring-teal-500 focus:border-teal-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full p-2 border border-teal-200 rounded focus:ring-teal-500 focus:border-teal-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 rounded transition"
          >
            Ingresar al Portal
          </button>
        </form>
      </div>
    </main>
  );
}