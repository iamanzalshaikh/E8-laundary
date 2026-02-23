import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import app from "./app.js";
import connectDB from "./config/db.js";
import config from "./config/config.js";
import initializeSocket from "./config/socket.js";
import logger from "./config/logger.js";


const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Create HTTP Server
    const httpServer = createServer(app);

    // Initialize Socket.io
    const io: SocketIOServer = initializeSocket(httpServer);

    // Attach IO to app for access in controllers
    (app as any).io = io;

    // Start Server
    httpServer.listen(config.PORT, () => {
      logger.info(`🚀 E8 Backend running at http://localhost:${config.PORT}`);
    });

    // Graceful Shutdown
    const shutdown = () => {
      logger.info("Shutting down gracefully...");
      httpServer.close(() => {
        logger.info("HTTP server closed");
        process.exit(0);
      });
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);

    process.on("uncaughtException", (error) => {
      logger.error(`❌ Uncaught Exception: ${error.message}`);
      process.exit(1);
    });

    process.on("unhandledRejection", (reason, promise) => {
      logger.error(`❌ Unhandled Rejection at ${promise}: ${reason}`);
    });
  } catch (error: any) {
    logger.error(`❌ Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
