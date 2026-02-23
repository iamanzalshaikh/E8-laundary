import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import apiRoutes from "./routes/index.js";
import logger from "./config/logger.js";
import config from "./config/config.js";

const app: express.Express = express();

// Middlewares
app.use(cors({
  origin: config.FRONTEND_URL || true,
  credentials: true,
}));

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/v1", apiRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error(`Error: ${err.message}`);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: config.NODE_ENV === "development" ? err.stack : undefined,
  });
});

export default app;
