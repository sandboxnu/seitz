import { Router } from "express";
import HttpError from "../types/errors";

import { success, successStatus } from "../util/api";
import passport from "passport";
import User from "../models/auth";
import { Strategy } from "passport-local";

const router = Router();

console.log("hi");

router.post("/signup", (req, res, next) => {
  const { email, password } = req.body;
  if (typeof(email) !== "string" || typeof(password) !== "string") {
    res.status(400).send({message: "Must have fields email and password"});
  } else {
    //store email and password in db
    res.send("Sign up completed")
  }
});

// https://www.npmjs.com/package/passport-local-mongoose 
router.post("/login", (req, res, next) => {
  passport.use(new Strategy(User.authenticate()));
  //passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
});

router.post("/logout", (req, res, next) => {
    success
});

export default router;
