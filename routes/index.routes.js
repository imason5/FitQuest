const express = require("express");
const router = express.Router();

const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard");

/* GET home page */
router.get("/", isLoggedIn, (req, res, next) => {
  res.render("index", { navSwitch: true }); // If navSwitch is true, then switch navbar for logged-in user
});

module.exports = router;
