import { Router } from "express";
import HttpError from "../types/errors";

import { success, successStatus } from "../util/api";
import passport from "passport";
import User, { IUser } from "../models/auth";
import { Strategy as LocalStrategy } from "passport-local";

const router = Router();

passport.use(
    new LocalStrategy((email, password, done) => {
        User.findOne({ email }, (err: Error, user: IUser | false) => {
            if (err) {
                return done(err);
            } else if (!user) {
                return done(null, false, { message: "No user for the given email" });
            } else if (!user.verifyPassword(password)) {
                return done(null, false, { message: "The given password is incorrect" });
            } else {
                return done(null, user);
            }
        });
    })
);

// https://stackoverflow.com/questions/32398120/passport-allow-sign-up-with-name-and-email-address-local-strategy
router.post("/signup", (req, res, next) => {
    const { email, password } = req.body;
    if (typeof email !== "string" || typeof password !== "string") {
        res.status(400).send({ message: "Must have fields email and password" });
    } else {
        //store email and password in db
        const newUser = new User({ email, password });
        newUser
            .save()
            .then(({ email }) => res.send(`Sign up for ${email} has been successful.`))
            .catch((error: Error) => res.status(400).send(error.message));
    }
});

// https://www.npmjs.com/package/passport-local-mongoose
router.post("/login", passport.authenticate("local"), (req, res, next) => {
    res.send("Login successful");
});

router.post("/logout", (req, res, next) => {
    success;
});

export default router;
