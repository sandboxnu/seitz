import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';


import exampleRoutes from './routes/example'
import errorHandler from './middleware/error';

dotenv.config();

// Database connection
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/seitz');
const mongo = mongoose.connection;
mongo.on("error", console.error.bind(console, "Connection error:"));
mongo.once("open", () => {
  console.log("Database connected!");
});

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(bodyParser.json())
app.use(cors());

// Routes
app.use("/example/", exampleRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
