const express = require("express");
const router = express.Router();

const { isLoggedIn } = require("../middleware/route-guard");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

module.exports = router;
