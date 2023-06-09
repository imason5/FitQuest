const express = require("express");
const router = express.Router();

/* --- Import models --- */
const User = require("../models/User.model");
const Workout = require("../models/Workout.model");

/* --- Import middlewares --- */
const { validateSignupInput } = require("../middleware/inputValidation");
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard");
const uploader = require("../middleware/cloudinary.config.js");

/* --- Import bcryptjs --- */
const bcryptjs = require("bcryptjs");
const roundOfSalt = 13;
const pwdRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;

/* --- GET: signup page --- */
router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

/* --- POST: signup page --- */
router.post(
  "/signup",
  /*validateSignupInput,*/
  uploader.single("imageUrl"),
  async (req, res, next) => {
    try {
      //console.log(req.body);
      //console.log(req.file);

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
            const newUser = await User.create({
              username: req.body.username,
              password: passwordHash,
              email: req.body.email,
              age: req.body.age,
              gender: req.body.gender,
              weight: req.body.weight,
              height: req.body.height,
              bio: req.body.bio,
            });
            // If user uploads profile picture, then update the profilePic url to req.file.path.
            if (req.file) {
              await User.findByIdAndUpdate(
                newUser._id,
                {
                  profilePic: req.file.path,
                },
                { new: true }
              );
            }
            // After Signing up, then redirect to login page
            res.render("auth/login", { navSwitch: false });
          } else {
            // When psw is not strong enough
            res.render("auth/signup", {
              username: req.body.username,
              errorMessage:
                "Password must be at least 8 characters long, and contain at least one letter and one number.",
              navSwitch: false,
            });
          }
        } else {
          // When email is already taken
          res.render("auth/signup", {
            username: req.body.username,
            email: req.body.email,
            errorMessage: "This email is in use",
            navSwitch: false,
          });
        }
      } else {
        // When username is already existed
        res.render("auth/signup", {
          username: req.body.username,
          email: req.body.email,
          errorMessage: "This username is in use",
          navSwitch: false,
        });
      }
    } catch (error) {
      console.log("Error from signup post: ", error);
    }
  }
);

/* --- GET: login page --- */
router.get("/login", (req, res, next) => {
  res.render("auth/login", { navSwitch: false });
});

/* --- POST: login page --- */
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const isExistingUser = await User.findOne({ username });
    const loggedInUserWorkouts = await Workout.find(
      { userId: isExistingUser._id },
      null,
      { sort: { date: -1 } }
    );

    if (isExistingUser) {
      if (bcryptjs.compareSync(password, isExistingUser.password)) {
        req.session.loggedInUser = isExistingUser;
        res.render("protected/profile", {
          loggedInUser: isExistingUser,
          loggedInUserWorkouts,
          navSwitch: true,
        });
      } else {
        res.render("auth/login", {
          username,
          errorMessage: "Password is not correct.",
          navSwitch: false,
        });
      }
    } else {
      res.render("auth/login", {
        username,
        errorMessage: "Username is not existed",
        navSwitch: false,
      });
    }
  } catch (error) {
    console.log("Error from login post: ", error);
  }
});

/* --- GET: logout request --- */
router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect("/");
  });
});

module.exports = router;
