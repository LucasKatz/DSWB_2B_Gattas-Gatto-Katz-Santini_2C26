import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { conectarDB } from "@/lib/db";
import paciente from "@/modelos/paciente";
import kinesio from "@/modelos/kinesio";
import admins from "@/modelos/admins";

export async function POST(req) {
  try {
    await conectarDB();
    const { email, password } = await req.json();

    let usuario = await paciente.findOne({ email }) || 
                  await kinesio.findOne({ email }) || 
                  await admins.findOne({ email });

    if (!usuario || !(await usuario.validarPassword(password))) {
      return NextResponse.json({ mensaje: "Credenciales inválidas" }, { status: 401 });
    }

    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    return NextResponse.json({
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ mensaje: error.message }, { status: 500 });
  }
}