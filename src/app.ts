import bodyParser from "body-parser";
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

import exampleRoutes from "./routes/example";
import authRoutes from "./routes/auth";
import errorHandler from "./middleware/error";
import passport from "passport";
import session from "express-session";

dotenv.config();

// Database connection
mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/seitz");
const mongo = mongoose.connection;
mongo.on("error", console.error.bind(console, "Connection error:"));
mongo.once("open", () => {
    console.log("Database connected!");
});

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(bodyParser.json());

app.use(
    session({
        secret: "TODO: Make secret key in ENV",
        resave: false,
        saveUninitialized: false,
    })
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/example/", exampleRoutes);
app.use("/auth/", authRoutes);

app.use(errorHandler);

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
