import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import passport from "passport";
import session from "express-session";

import exampleRoutes from "./routes/example";
import adminRoutes from "./routes/admin";
import authRoutes from "./routes/auth";
import studiesRoutes from "./routes/studies";
import tasksRoutes from "./routes/tasks";
import errorHandler from "./middleware/error";

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(
  cors({
    origin: [process.env.CLIENT_URL ?? "http://localhost:5173"],
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET ?? "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: process.env.SECURE === "true" ? "none" : "lax",
      secure: process.env.SECURE === "true",
      maxAge: 8 * 60 * 60 * 1000,
      httpOnly: true,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/admin/", adminRoutes);
app.use("/example/", exampleRoutes);
app.use("/studies/", studiesRoutes);
app.use("/tasks/", tasksRoutes);
app.use("/auth/", authRoutes);

app.use(errorHandler);

export default app;
