// pages/api/[[...ruta]].js
// Puente entre Next.js y Express: toda petición a /api/* la atiende la app Express.
// Vercel publica este archivo como una función serverless de Node.js.
import app from "../../servidor/app.js";

export const config = {
  api: {
    bodyParser: false, // Express lee el body con express.json()
    externalResolver: true, // la respuesta la envía Express, no Next.js
  },
};

export default app;
