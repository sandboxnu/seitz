import { User } from "../models";
import HttpError from "../types/errors";
import { APIResponse } from "../util/handlers";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import sgMail from "@sendgrid/mail";
import crypto from "crypto";
import { IUser } from "@seitz/shared";
import * as redisService from "./redis.service";

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
  const { name, email, password } = req.body;
  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof name !== "string"
  ) {
    next(new HttpError(400, "Must have fields name, email, and password"));
  } else {
    const token = crypto.randomBytes(20).toString("hex");
    User.create({ name, email, password, token })
      .then(async (user) => {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
        const URL = `http://localhost:4000/auth/verify/${user.token}`;
        const msg = {
          to: `${email}`,
          from: "chow.am@northeastern.edu", // Change to your verified sender
          subject: "Brain Game Center: Verify Your Email",
          html: `<p>Welcome to Brain Game Center! Please verify your email by clicking this <a href="${URL}">link</a>.</p>`,
        };
        sgMail.send(msg).catch((error: any) => {
          console.error(error);
        });

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

export const login = async (req: any): APIResponse<void> => {
  const user = req.user;
  await redisService.loadFromDatabase(user._id.toString());
  return [200];
};

export const logout = async (req: any): APIResponse<void> => {
  const userId = req.user?._id;

  if (userId) {
    await redisService.saveToDatabase(userId.toString());
  }
  req.logout((err: any) => {
    if (err) {
      throw new HttpError(500);
    }
  });
  return [200];
};

export const getUser = async (req: any): APIResponse<IUser> => {
  return [200, req.user];
};

export const getUsers = async (): APIResponse<IUser[]> => {
  const users = await User.find();
  return [200, users];
};

export const updateUser = async (req: any): APIResponse<IUser> => {
  const user = req.user;
  if (!user) throw new HttpError(401, "Unauthorized");

  const { name, email, password } = req.body as Partial<IUser> & {
    password?: string;
  };

  if (typeof name === "string") user.name = name;
  if (typeof email === "string") user.email = email;
  if (typeof password === "string" && password.length > 0)
    user.password = password;

  await user.save();
  return [200, user];
};

export const verifyToken = async (req: any): APIResponse<string> => {
  const token = req.params.token;
  try {
    const user = await User.findOne({ token: token });
    if (!user) {
      throw new HttpError(404, "Token not found");
    }
    user.verified = true;
    user.token = "";
    await user.save();
    return [200, "Your email has been verified!"];
  } catch (err) {
    throw new HttpError(500, `Could not verify:  + ${err}`);
  }
};
