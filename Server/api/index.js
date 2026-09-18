import app from "../app.js";
import dbconnect from "../config/mongo.js";

// Initialize database connection (cached by mongoose across serverless invocations)
dbconnect().catch((err) => {
  console.error("Database connection error during serverless startup:", err);
});

export default app;
