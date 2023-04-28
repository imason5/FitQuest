const express = require("express");
const router = express.Router();
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard");

const User = require("../models/User.model");

/* --- GET: profile page --- */
router.get("/profile", isLoggedIn, (req, res, next) => {
  // Changed from "/protected/profile"
  const loggedInUser = req.session.loggedInUser;
  res.render("protected/profile", { loggedInUser });
  //console.log(loggedInUser);
});

/* --- POST: profile page --- */
router.post("/profile/:userId", isLoggedIn, async (req, res, next) => {
  try {
    console.log("updated user info: ", req.body);
    console.log(req.params); // { userId: '644ba5cae6a408d51884eda4' }
    const loggedInUser = await User.findByIdAndUpdate(req.params.userId, {
      ...req.body,
      username: req.body.username,
      age: req.body.age,
      gender: req.body.gender,
    });
    console.log(loggedInUser);
    // res.render("protected/profile", { loggedInUser });
  } catch (error) {
    console.log("Error from profile post: ", error);
  }
});

// /* --- GET: workout page --- */
router.get("/workout", (req, res, next) => {
  res.render("protected/workout");
});

module.exports = router;
