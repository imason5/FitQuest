const express = require("express");
const router = express.Router();
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard");

/* --- GET: profile page --- */
router.get("/protected/profile", isLoggedIn, (req, res, next) => {
  const loggedInUser = req.session.loggedInUser;
  res.render("protected/profile", { loggedInUser });
});

// /* --- GET: workout page --- */
router.get("/workout", (req, res, next) => {
  res.render("protected/workout");
});

module.exports = router;
