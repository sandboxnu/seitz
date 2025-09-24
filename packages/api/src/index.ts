import mongoose from "mongoose";
import dotenv from "dotenv";

import app from "./app";

dotenv.config();

import "./redis";

const port = process.env.PORT || 4000;

// Database connection
mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/seitz");
const mongo = mongoose.connection;
mongo.on("error", console.error.bind(console, "Connection error:"));
mongo.once("open", () => {
  console.log("Database connected!");
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
