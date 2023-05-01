const express = require("express");
const User = require("../models/User.model");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const { validateSignupInput } = require("../middleware/inputValidation");
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard");

const roundOfSalt = 13;
const pwdRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;

/* --- GET: signup page --- */
router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

/* --- POST: signup page --- */
router.post("/signup", validateSignupInput, async (req, res, next) => {
  try {
    const isExistingUsername = await User.findOne({
      username: req.body.username,
    });
    const isExistingEmail = await User.findOne({
      email: req.body.email,
    });

    if (!isExistingUsername) {
      if (!isExistingEmail) {
        if (pwdRegex.test(req.body.password)) {
          const salt = bcryptjs.genSaltSync(roundOfSalt);
          const passwordHash = bcryptjs.hashSync(req.body.password, salt);
          // Create a new user via User model
          await User.create({
            username: req.body.username,
            password: passwordHash,
            email: req.body.email,
            age: req.body.age,
            gender: req.body.gender,
            weight: req.body.weight,
            height: req.body.height,
            bio: req.body.bio,
          });
          // After Signing up, then redirect to login page - redirect
          res.redirect("/login");
        } else {
          // When psw is not strong enough
          res.render("auth/signup", {
            username: req.body.username,
            errorMessage: "Password is not strong enought",
          });
        }
      } else {
        // When email is already taken
        res.render("auth/signup", {
          username: req.body.username,
          email: req.body.email,
          errorMessage: "Email is in use",
        });
      }
    } else {
      // When username is already existed
      res.render("auth/signup", {
        username: req.body.username,
        errorMessage: "Username is in use",
      });
    }
  } catch (error) {
    console.log("Error from signup post: ", error);
  }
});

/* --- GET: login page --- */
router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

/* --- POST: login page --- */
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const isExistingUser = await User.findOne({ username });

    if (isExistingUser) {
      if (bcryptjs.compareSync(password, isExistingUser.password)) {
        req.session.loggedInUser = isExistingUser;
        res.redirect("/profile");
      } else {
        res.render("auth/login", { username });
      }
    } else {
      res.render("auth/login", { username });
    }
  } catch (error) {
    console.log("Error from login post: ", error);
  }
});

/* --- GET: logout request --- */
router.get("/logout", isLoggedIn, (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect("/");
  });
});

module.exports = router;
