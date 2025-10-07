import express from "express";
import cors from "cors";
import HealthCheckRoute from "./routes/healthcheck.route.js";
import AuthRoute from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
const app = express();

// basic congifuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

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

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
