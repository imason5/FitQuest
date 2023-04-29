const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard");

const User = require("../models/User.model");
const { render } = require("ejs");

const roundOfSalt = 13;
const pwdRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;

/* --- GET: profile page --- */
router.get("/profile", isLoggedIn, (req, res, next) => {
  // Changed from "/protected/profile"
  const loggedInUser = req.session.loggedInUser;
  res.render("protected/profile", { loggedInUser });
  //console.log(loggedInUser);
});

/* --- POST: profile page --- */
router.post("/profile", isLoggedIn, async (req, res, next) => {
  try {
    const { username, email, password, userId } = req.body;

    const isUpdatingUser = User.findById(userId);
    const isUpdatingUsername = isUpdatingUser.username;
    const isUpdatingEmail = isUpdatingUser.email;

    //If new username has not been taken or username remains the same
    if (!isUpdatingUsername || isUpdatingUsername === username) {
      //If new email is not taken or email remains the same
      if (!isUpdatingEmail || isUpdatingEmail === email) {
        if (!req.body.password) {
          //If user don't update password
          await User.findByIdAndUpdate(
            req.body.userId,
            {
              username: req.body.username,
              email: req.body.email,
              age: req.body.age,
              gender: req.body.gender,
              weight: req.body.weight,
              height: req.body.height,
              bio: req.body.bio,
            },
            { new: true }
          )
            .then((newInfo) => {
              res.render("protected/profile", { loggedInUser: newInfo });
            })
            .catch((error) => {
              console.log(
                "Error from updating user info - without password",
                error
              );
            });
        } else {
          //If user updates password
          const salt = bcryptjs.genSaltSync(roundOfSalt);
          const isUpdatingPasswordHash = bcryptjs.hashSync(
            req.body.password,
            salt
          );

          await User.findByIdAndUpdate(
            req.body.userId,
            {
              username: req.body.username,
              password: isUpdatingPasswordHash,
              email: req.body.email,
              age: req.body.age,
              gender: req.body.gender,
              weight: req.body.weight,
              height: req.body.height,
              bio: req.body.bio,
            },
            { new: true }
          )
            .then((newInfo) => {
              res.render("protected/profile", { loggedInUser: newInfo });
            })
            .catch((error) => {
              console.log("Error from updating user info - with password");
            });
        }
      } else {
        //If new email is taken
        res.render("protected/profile", {
          loggedInUser: req.body,
          errorMessage: "Email is already in use",
        });
      }
    } else {
      res.render("protected/profile", {
        loggedInUser: newInfo,
        errorMessage: "Username is already in use",
      });
    }
  } catch (error) {
    console.log("Error from try catch: ", error);
  }
});

// /* --- GET: workout page --- */
router.get("/workout", (req, res, next) => {
  res.render("protected/workout");
});

module.exports = router;
