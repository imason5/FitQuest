const express = require("express");
const router = express.Router();

// Test Routes for Session Management - can be removed later
router.get("/set-session", (req, res) => {
  if (!req.session.counter) {
    req.session.counter = 1;
  } else {
    req.session.counter += 1;
  }
  res.send(`Session counter set to: ${req.session.counter}`);
});

router.get("/get-session", (req, res) => {
  if (req.session.counter) {
    res.send(`Session counter: ${req.session.counter}`);
  } else {
    res.send("Session counter not set.");
  }
});

module.exports = router;
