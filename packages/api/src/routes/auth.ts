import { Router } from "express";
import passport from "passport";
import User from "../models/user";
import { Strategy as LocalStrategy } from "passport-local";
import isAuthenticated from "../middleware/auth";
import HttpError from "../types/errors";

const router = Router();

passport.use(
  new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    User.findOne({ email })
      .then((user) => {
        if (!user) {
          done(null, false, { message: "No user exists for the given email" });
        } else {
          user
            .verifyPassword(password)
            .then((outcome) => {
              if (!outcome) {
                done(null, false, {
                  message: "The given password is incorrect",
                });
              } else {
                done(null, user);
              }
            })
            .catch(done);
        }
      })
      .catch(done);
  })
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
    const newUser = new User({ email, password });
    newUser
      .save()
      .then((user) => {
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
