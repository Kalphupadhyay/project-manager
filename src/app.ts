import express from "express";
import cors from "cors";
import HealthCheckRoute from "./routes/healthcheck.route.js";
import AuthRoute from "./routes/auth.route.js";
import ProjectRoute from "./routes/project.route.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
const app = express();

dotenv.config();

// basic congifuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

console.log("CORS_ORIGIN:", process.env.CORS_ORIGIN);

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

//Health check routes
app.use("/api/v1/healthcheck", HealthCheckRoute);

// Auth routes
app.use("/api/v1/auth", AuthRoute);

// project routes
app.use("/api/v1/projects", ProjectRoute);

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
