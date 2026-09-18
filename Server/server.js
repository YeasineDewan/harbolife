import { config } from "dotenv";
import app from "./app.js";
import dbconnect from "./config/mongo.js";

config();

const port = process.env.PORT || 3000;
const HOST = process.env.IP || "0.0.0.0";

dbconnect()
  .then(() => {
    app.listen(port, HOST, () =>
      console.log(`Server is running on http://${HOST}:${port}`),
    );
  })
  .catch((err) => {
    console.error("Failed to connect DB or start server:", err.message);
  });

  
