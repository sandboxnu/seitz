import mongoose from "mongoose";
import dotenv from "dotenv";
import https from "https";
import fs from "fs";

import app from "./app";

dotenv.config();

const port = process.env.PORT || 4000;

// Database connection
mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/seitz");
const mongo = mongoose.connection;
mongo.on("error", console.error.bind(console, "Connection error:"));
mongo.once("open", () => {
  console.log("Database connected!");
});

if (process.env.SECURE === "true") {
  const httpsServer = https.createServer(
    {
      key: fs.readFileSync("ssl/seitz.key"),
      cert: fs.readFileSync("ssl/seitz.crt"),
    },
    app
  );

  httpsServer.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
  });
} else {
  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });
}
