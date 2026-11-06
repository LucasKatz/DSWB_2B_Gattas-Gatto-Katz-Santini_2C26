// servidor/config/db.js
// Conexión a MongoDB con caché global, apta para entornos serverless (Vercel).
import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function conectarDB() {
  if (cached.conn) {
    return cached.conn;
  }

  // Se lee y valida al conectar (no al importar) para que el build de Vercel
  // no falle si la variable todavía no está disponible en esa etapa.
  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    throw new Error("Por favor define la variable MONGO_URI (archivo .env o variables de entorno de Vercel)");
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    };

    cached.promise = mongoose.connect(MONGO_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default conectarDB;
