import app from "../app.js";
import dbconnect from "../config/mongo.js";
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.warn("MONGO_URI is not set — database-dependent routes will return 503.");
} else {
  mongoose.set("strictQuery", true);
  dbconnect().catch((err) => {
    console.error("Database connection error during serverless startup:", err.message);
  });
}

app.get("/health", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = { 0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting", 99: "uninitialized" };
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    database: {
      status: states[dbState] || "unknown",
      uri_configured: !!MONGO_URI,
    },
  });
});

app.use("/api", (req, res, next) => {
  if (!MONGO_URI) {
    return res.status(503).json({
      status: "error",
      message: "Database is not configured. Set the MONGO_URI environment variable.",
    });
  }
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      status: "error",
      message: "Database is not connected. Please try again later.",
    });
  }
  next();
});

export default app;
