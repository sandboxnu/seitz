import { Router } from "express";
import passport from "passport";
import { User } from "../models";
import { Strategy as LocalStrategy } from "passport-local";
import isAuthenticated from "../middleware/auth";
import HttpError from "../types/errors";
import sgMail from "@sendgrid/mail";
import crypto from "crypto";

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
    const token = crypto.randomBytes(20).toString("hex");
    User.create({ email, password, token })
      .then(async (user) => {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
        const URL = `http://localhost:4000/auth/verify/${user.token}`;
        const msg = {
          to: `${email}`,
          from: "chow.am@northeastern.edu", // Change to your verified sender
          subject: "Brain Game Center: Verify Your Email",
          html: `<p>Welcome to Brain Game Center! Please verify your email by clicking this <a href="${URL}">link</a>.</p>`,
        };
        sgMail
          .send(msg)
          .then(() => {
            console.log("Email sent");
          })
          .catch((error) => {
            console.error(error);
          });

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

router.get("/verify/:token", async (req, res) => {
  const token = req.params.token;
  try {
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).send("Token not found");
    }
    user.verified = true;
    user.token = "";
    await user.save();
    res.status(200).send("Verified!");
  } catch (err) {
    res.status(500).send("Could not verify: " + err);
  }
});

export default router;
