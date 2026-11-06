import { NextResponse } from "next/server";
import { conectarDB } from "@/lib/db";
import paciente from "@/modelos/paciente";


export async function GET() {
  try {
    await conectarDB();
    const pacientes = await paciente.find().select("-password");
    return NextResponse.json(pacientes, { status: 200 });
  } catch (error) {
    return NextResponse.json({ mensaje: error.message }, { status: 500 });
  }
}