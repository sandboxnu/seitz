import { Router } from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

import { User } from "../models";
import { isAuthenticated } from "../middleware/auth";
import HttpError from "../types/errors";

const router = Router();

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          done(new HttpError(401, "Incorrect email or password"), false);
        } else {
          const correctPassword = await user.verifyPassword(password);
          if (!correctPassword) {
            done(new HttpError(401, "Incorrect email or password"), false);
          } else {
            done(null, user);
          }
        }
      } catch (e) {
        done(e);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((id, done) =>
  User.findById(id)
    .then((user) => done(null, user))
    .catch(done)
);

router.post("/signup", (req, res, next) => {
  const { email, password } = req.body;
  if (typeof email !== "string" || typeof password !== "string") {
    next(new HttpError(400, "Must have fields email and password"));
  } else {
    User.create({ email, password })
      .then(async (user) => {
        req.login(user, (err) => {
          if (!err) res.sendStatus(201);
          else next(err);
        });
      })
      .catch((err) => {
        if (err.name == "MongoServerError" && err.code === 11000) {
          next(new HttpError(400, "That email is taken"));
        } else {
          next(err);
        }
      });
  }
});

router.post(
  "/login",
  passport.authenticate("local", { failWithError: true }),
  (req, res) => {
    res.sendStatus(200);
  }
);

router.post("/logout", isAuthenticated, (req, res, next) => {
  req.logout((err) => {
    if (err) {
      next(new HttpError(500));
    } else {
      res.sendStatus(200);
    }
  });
});

router.get("/user", isAuthenticated, (req, res) => {
  res.json(req.user);
});

export default router;
