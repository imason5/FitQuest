const express = require("express");
const User = require("../models/User.model");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const roundOfSalt = 13;

const pwdRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;

/* --- 1. GET: signup page --- */
router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

/* --- 2. POST: signup page --- */
router.post("/signup", async (req, res, next) => {
  try {
    const potentialUser = await User.findOne({ username: req.body.username });

    if (!!potentialUser === false) {
      const pwdStrength = pwdRegex.test(req.body.password);
      console.log(pwdStrength, req.body.password);

      if (pwdRegex.test(req.body.password)) {
        const salt = bcryptjs.genSaltSync(roundOfSalt);
        const passwordHash = bcryptjs.hashSync(req.body.password, salt);

        await User.create({
          username: req.body.username,
          password: passwordHash,
          email: req.body.email,
        });
        res.redirect("/auth/signup"); // change the path to login page once login page is done
      } else {
        res.render("auth/signup");
      }
    } else {
      res.render("auth/signup");
    }
  } catch (error) {
    console.log("Error from signup post: ", error);
  }
});

module.exports = router;
