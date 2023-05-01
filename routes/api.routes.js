const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const path = require("path");

const { isLoggedIn } = require("../middleware/route-guard");
const { storeExercise } = require(path.join(
  __dirname,
  "../public/js/exerciseHelpers"
));

const Exercise = require("../models/Exercise.model");
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

// API POST route to create a new workout
router.post("/create-workout", isLoggedIn, async (req, res, next) => {
  try {
    const userId = req.session.loggedInUser._id;
    const { workoutName } = req.body;

    const workout = await Workout.create({
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

// API GET route to fetch a single workout by ID
router.get("/get-workout/:workoutId", async (req, res) => {
  const workoutId = req.params.workoutId;
  try {
    const workout = await Workout.findById(workoutId);
    res.status(200).json(workout);
  } catch (error) {
    console.error("Error fetching workout:", error);
    res.sendStatus(500);
  }
});

// API GET route to fetch a single exercise log by ID
router.get("/get-exercise-log/:exerciseLogId", async (req, res) => {
  const exerciseLogId = req.params.exerciseLogId;
  try {
    const exerciseLog = await ExerciseLog.findById(exerciseLogId);
    res.status(200).json(exerciseLog);
  } catch (error) {
    console.error("Error fetching exercise log:", error);
    res.sendStatus(500);
  }
});

// API GET route to fetch a single exercise by ID
router.get("/get-exercise/:exerciseId", async (req, res) => {
  const exerciseId = req.params.exerciseId;
  try {
    const exercise = await Exercise.findById(exerciseId);
    res.status(200).json(exercise);
  } catch (error) {
    console.error("Error fetching exercise:", error);
    res.sendStatus(500);
  }
});

// API GET route to fetch exercise logs for a workout
router.get("/exercise-log/:workoutId", async (req, res) => {
  const workoutId = req.params.workoutId;

  try {
    // Find the workout by ID
    const workout = await Workout.findById(workoutId);

    // Find all exercise logs that belong to the workout
    const exerciseLogs = await ExerciseLog.find({
      _id: { $in: workout.exercises },
    }).populate("exerciseId");

    console.log("Fetched exerciseLogs:", exerciseLogs);
    res.json(exerciseLogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching exercise logs." });
  }
});

// API PUT route to finish a workout
router.put("/finish-workout/:workoutId", isLoggedIn, async (req, res) => {
  const workoutId = req.params.workoutId;

  try {
    const updatedWorkout = await Workout.findByIdAndUpdate(
      workoutId,
      {
        completed: true,
      },
      { new: true }
    ); // Add { new: true } option to return the updated document
    console.log("Updated Workout:", updatedWorkout); // Log the updated workout
    res.sendStatus(200);
  } catch (error) {
    console.error("Error finishing workout:", error);
    res.sendStatus(500);
  }
});

module.exports = router;
