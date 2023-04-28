const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const path = require("path");

const { isLoggedIn } = require("../middleware/route-guard");
const { storeExercise } = require(path.join(
  __dirname,
  "../public/js/exerciseHelpers"
));

const ExerciseLog = require("../models/ExerciseLog.model");
const Workout = require("../models/Workout.model");
const User = require("../models/User.model");

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

  // Store each fetched exercise in the database (or retrieve an existing one)
  for (const exerciseData of exercises) {
    const exerciseId = await storeExercise(exerciseData, search);
    exerciseData._id = exerciseId;
  }

  res.json(exercises);
});

// API POST route to save an exercise log
router.post("/exercise-log", isLoggedIn, async (req, res) => {
  const { workoutId, exerciseId, sets, reps, weight } = req.body;

  const exerciseLog = new ExerciseLog({
    workoutId,
    exerciseId,
    sets,
    reps,
    weight,
  });

  try {
    await exerciseLog.save();
    res.sendStatus(200);
  } catch (error) {
    console.error("Error saving ExerciseLog:", error);
    res.sendStatus(500);
  }
});

// API POST route to save a workout
router.post("/create-workout", isLoggedIn, async (req, res, next) => {
  try {
    const userId = req.session.loggedInUser._id;
    const { workoutName, workoutId } = req.body;

    const workout = await Workout.create({
      _id: workoutId,
      name: workoutName,
      userId: userId,
    });

    await User.findByIdAndUpdate(userId, {
      $push: { workouts: workout._id },
    });

    res.status(200).json(workout);
  } catch (error) {
    console.error("Error creating a new workout:", error);
    next(error);
  }
});
module.exports = router;
