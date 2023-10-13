import { Router } from "express";
import HttpError from "../types/errors";

import { success, successStatus } from "../util/api";
import passport from "passport";
import User from "../models/auth";
import { Strategy as LocalStrategy } from "passport-local";

const router = Router();

//passport.use(new LocalStrategy)

// https://stackoverflow.com/questions/32398120/passport-allow-sign-up-with-name-and-email-address-local-strategy
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
