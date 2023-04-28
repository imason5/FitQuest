const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

router.get("/search", async (req, res) => {
  const search = req.query.search;
  const apiKey = process.env.API_KEY;

  const response = await fetch(
    `https://api.api-ninjas.com/v1/exercises?name=${encodeURIComponent(
      search
    )}`,
    {
      headers: {
        "X-Api-Key": apiKey,
      },
    }
  );
  const exercises = await response.json();
  res.json(exercises);
});

module.exports = router;
