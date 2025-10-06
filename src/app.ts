import express from "express";
import cors from "cors";
import HealthCheckRoute from "./routes/healthcheck.route.js";
import AuthRoute from "./routes/auth.route.js";
const app = express();

// basic congifuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

//Health check routes
app.use("/api/v1/healthcheck", HealthCheckRoute);

// Auth routes
app.use("/api/v1/auth", AuthRoute);

export default app;
