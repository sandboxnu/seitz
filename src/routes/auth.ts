import { Router } from "express";
import HttpError from "../types/errors";

import { success, successStatus } from "../util/api";
import passport from "passport";
import User from "../models/auth";
import { Strategy as LocalStrategy } from "passport-local";

const router = Router();

passport.use(new LocalStrategy({ usernameField: "email"}, User.authenticate()));
passport.serializeUser(User.serializeUser())// as (user: Express.User, cb: (err: any, id?: any) => void) => void);
passport.deserializeUser(User.deserializeUser());

router.post("/signup", (req, res, next) => {
    const { email, password } = req.body;
    if (typeof email !== "string" || typeof password !== "string") {
        res.status(400).send({ message: "Must have fields email and password" });
    } else {
        //store email and password in db
        const newUser = new User({ email, password });
        //newUser.save
        
        User.register(newUser, password, (err) => {
            if (err) {
                res.status(400).send(err.message)
            } else {
                res.send("Sign up completed");
            }
            
            // passport.serializeUser(function(user, done) {
            //     // the values returned here will be used to deserializeUser
            //     // this can be use for further logins
            //     done(null, { newUser });
            // });
            
            // passport.deserializeUser(function(user, done) {
            //     done(null, newUser);
            // });

        });
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
