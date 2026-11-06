"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login"); // Redirige al Login si no hay token
    } else {
      router.push("/dashboard"); // Redirige al Dashboard si ya inició sesión
    }
  }, [router]);

  return null; // O un spinner/cargando breve
}