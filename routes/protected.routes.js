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

/* --- GET: profile page --- */
router.get("/profile", isLoggedIn, async (req, res, next) => {
  // Changed from "/protected/profile"
  const loggedInUser = req.session.loggedInUser; // return an object
  const loggedInUserWorkouts = await Workout.find(
    { userId: loggedInUser._id, completed: true },
    null,
    { sort: { date: -1 } }
  ); // return an array
  res.render("protected/profile", {
    loggedInUser,
    loggedInUserWorkouts,
    navSwitch: true,
  });
});

/* --- POST: profile page --- */
router.post("/profile", uploader.single("imageUrl"), async (req, res, next) => {
  try {
    const { username, email, password, userId } = req.body;
    const currentUser = await User.findById(userId);
    const currentUserWorkouts = await Workout.find(
      { userId: userId, completed: true },
      null,
      { sort: { date: -1 } }
    );
    await User.findOne({ $or: [{ username }, { email }] })
      .then((existingUser) => {
        const existingUserId = existingUser._id.toString();

        if (existingUser && existingUserId !== userId) {
          return res.status(400).render("protected/profile", {
            loggedInUser: currentUser,
            loggedInUserWorkouts: currentUserWorkouts,
            errorMessage: "Username or email already taken",
            navSwitch: true,
          });
        } else if (!existingUser || existingUserId === userId) {
          currentUser.username = req.body.username;
          currentUser.email = req.body.email;
          currentUser.age = req.body.age;
          currentUser.gender = req.body.gender;
          currentUser.weight = req.body.weight;
          currentUser.height = req.body.height;
          currentUser.bio = req.body.bio;

          // If user is updating profile picture, then profilePic url equals to req.file.path.
          if (req.file) {
            currentUser.profilePic = req.file.path;
          }

          // If user is updating password
          if (password && pwdRegex.test(password)) {
            const salt = bcryptjs.genSaltSync(roundOfSalt);
            currentUser.password = bcryptjs.hashSync(password, salt);
          } else if (password && !pwdRegex.test(password)) {
            return res.status(400).render("protected/profile", {
              loggedInUser: currentUser,
              loggedInUserWorkouts: currentUserWorkouts,
              errorMessage: "Password is not strong enough",
              navSwitch: true,
            });
          }

          currentUser
            .save()
            .then((loggedInUser) => {
              res.render("protected/profile", {
                loggedInUser,
                loggedInUserWorkouts: currentUserWorkouts,
                navSwitch: true,
              });
            })
            .catch((error) => {
              console.log("Error from saving updated info: ", error);
            });
        }
      })
      .catch((error) => console.log("Error from updating info: ", error));
  } catch (error) {
    res.render("protected/profile", {
      loggedInUser: currentUser,
      loggedInUserWorkouts: currentUserWorkouts,
      errorMessage: "Error updating profile",
      navSwitch: true,
    });
  }
});

/* --- POST: delete one workout on profile page --- */
router.post("/profile/workoutsDelete/:workoutId", async (req, res) => {
  try {
    await Workout.findByIdAndDelete(req.params.workoutId);
    res.redirect("/profile");
  } catch (error) {
    console.log(error);
  }
});

// /* --- GET: workout page --- */
router.get("/workout", isLoggedIn, (req, res, next) => {
  res.render("protected/workout", { isLoggedIn, navSwitch: true });
});

module.exports = router;
