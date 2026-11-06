import { NextResponse } from "next/server";
import { conectarDB } from "@/lib/db";
import paciente from "@/modelos/paciente";
import kinesio from "@/modelos/kinesio";
import admins from "@/modelos/admins";

export async function POST(req) {
  try {
    await conectarDB();
    const { nombre, email, password, rol } = await req.json();

    // Verificar existencia en las 3 colecciones
    const [existePaciente, existeKinesio, existeAdmin] = await Promise.all([
      paciente.findOne({ email }),
      kinesio.findOne({ email }),
      admins.findOne({ email })
    ]);

    if (existePaciente || existeKinesio || existeAdmin) {
      return NextResponse.json(
        { mensaje: "El correo ya está registrado en la plataforma." },
        { status: 400 }
      );
    }

    let nuevoUsuario;
    if (rol === "paciente") nuevoUsuario = new paciente({ nombre, email, password, rol });
    else if (rol === "kinesio") nuevoUsuario = new kinesio({ nombre, email, password, rol });
    else if (rol === "admin") nuevoUsuario = new admins({ nombre, email, password, rol });
    else {
      return NextResponse.json({ mensaje: "El rol no es válido." }, { status: 400 });
    }

    await nuevoUsuario.save();

    return NextResponse.json(
      { mensaje: `Usuario registrado con éxito como ${rol}` },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ mensaje: error.message }, { status: 500 });
  }
}