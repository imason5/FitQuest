const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const path = require("path");
const { storeExercise } = require(path.join(
  __dirname,
  "../public/js/exerciseHelpers"
));

// API GET route to search for exercises
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

  // // Store each fetched exercise in the database (or retrieve an existing one)
  // for (const exerciseData of exercises) {
  //   const exerciseId = await storeExercise(exerciseData);
  //   exerciseData._id = exerciseId;
  // }

  res.json(exercises);
});

module.exports = router;
