import { NextResponse } from "next/server";
import { conectarDB } from "@/lib/db";
import kinesio from "@/modelos/kinesio";

export async function GET() {
  try {
    await conectarDB();
    const kinesios = await kinesio.find().select("-password");
    return NextResponse.json(kinesios, { status: 200 });
  } catch (error) {
    return NextResponse.json({ mensaje: error.message }, { status: 500 });
  }
}