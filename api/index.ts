// Vercel Serverless Function — wraps the Express app
// Vercel calls this file as a handler for all /api/* requests
import app from "../artifacts/api-server/src/app.js";

export default app;
