// servidor/index.js
// Arranque LOCAL del servidor Express por separado (npm run api).
// En Vercel no se usa: allí la API corre dentro de Next.js (pages/api/[[...ruta]].js).
import app from "./app.js";

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Servidor KineVida corriendo en el puerto ${PORT}`);
});
