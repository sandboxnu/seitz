import { User } from "../models";
import HttpError from "../types/errors";
import { APIResponse } from "../util/handlers";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

/* eslint-disable @typescript-eslint/no-explicit-any */

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

export const signUp = async (req: any, res: any, next: any): Promise<void> => {
  const { email, password } = req.body;
  if (typeof email !== "string" || typeof password !== "string") {
    next(new HttpError(400, "Must have fields email and password"));
  } else {
    User.create({ email, password })
      .then(async (user) => {
        req.login(user, (err: any) => {
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
};

export const login = async (): APIResponse<void> => {
  return [200];
};

export const logout = async (req: any): APIResponse<void> => {
  req.logout((err: any) => {
    if (err) {
      throw new HttpError(500);
    }
  });
  return [200];
};

export const getUser = async (req: any): APIResponse<void> => {
  return [200, req.user];
};
