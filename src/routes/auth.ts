import { Router } from "express";
import passport from "passport";
import User from "../models/auth";
import { Strategy as LocalStrategy } from "passport-local";

const router = Router();

passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
        User.findOne({ email })
            .then((user) => {
                if (!user) {
                    done(null, false, { message: "No user exists for the given email" });
                } else if (user?.verifyPassword(password)) {
                    done(null, user);
                } else {
                    done(null, false, { message: "The given password is incorrect" });
                }
            })
            .catch(done);
    })
);
// TODO: Implement these
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((id, done) =>
    User.findById(id)
        .then((user) => done(null, user))
        .catch(done)
);

router.post("/signup", (req, res, next) => {
    const { email, password } = req.body;
    if (typeof email !== "string" || typeof password !== "string") {
        res.status(400).send({ message: "Must have fields email and password" });
    } else {
        const newUser = new User({ email, password });
        newUser
            .save()
            .then(({ email }) => res.send(`Sign up for ${email} has been successful.`))
            .catch((error: Error) => res.status(400).send(error.message));
    }
});

router.post("/login", passport.authenticate("local"), (req, res, next) => {
    res.send("Login successful");
});

router.post("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            res.status(500).send("Failed to log out");
        } else {
            res.send("Success logging out");
        }
    });
});

export default router;
