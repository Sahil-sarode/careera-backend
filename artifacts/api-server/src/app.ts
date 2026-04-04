import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import session from "express-session";
import cookieParser from "cookie-parser";
import router from "./routes/index.js";
import { logger } from "./lib/logger.js";
import { db } from "@workspace/db"; 

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

const allowedOrigins = process.env.NODE_ENV === "production"
  ? ["https://careerra.in", "https://www.careerra.in"]
  : true;

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || "careera-dev-secret-2024",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  },
}));
app.get("/test", (req, res) => {
  res.send("Test route working ✅");
});
app.get("/db-check", async (req, res) => {
  try {
    const result = await db.execute(`SELECT * FROM events LIMIT 1`);
    res.json(result);
  } catch (err: any) {
    console.error("DB ERROR 👉", err);
    res.status(500).json({ error: err.message });
  }
});

app.use("/api", router);

export default app;
