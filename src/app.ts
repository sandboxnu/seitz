import bodyParser from 'body-parser';
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import exampleRoutes from './routes/example'
import authRoutes from './routes/auth'
import errorHandler from './middleware/error';
import {Strategy} from 'passport-local';
import passport from 'passport';

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

// const strategy = new Strategy(function verify(username, password, cb) {
//   //implement getting username and password from db
// }

// Middleware
app.use(bodyParser.json())

// Routes
app.use("/example/", exampleRoutes);
app.use("/auth/", authRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
