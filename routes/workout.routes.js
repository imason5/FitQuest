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

const { calculateTotalWeight } = require("../utils/workout.helpers");

// Route to search for exercises (API call)
router.get("/search", async (req, res) => {
  const { search } = req.query;
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

  for (const exerciseData of exercises) {
    const exerciseId = await storeExercise(exerciseData, search);
    exerciseData._id = exerciseId;
  }

  res.json(exercises);
});

// Route to save an exercise log
router.post("/exercise-log", isLoggedIn, async (req, res) => {
  const { workoutId, exerciseId, sets } = req.body;

  console.log("workoutId (before creating ExerciseLog):", workoutId);
  console.log("exerciseId (before creating ExerciseLog):", exerciseId);
  console.log("sets (before creating ExerciseLog):", sets);
  const exerciseLog = new ExerciseLog({
    workoutId,
    exerciseId,
    sets,
  });

  try {
    const savedExerciseLog = await exerciseLog.save();

    await Workout.findByIdAndUpdate(workoutId, {
      $push: { exerciseLogs: savedExerciseLog._id },
    });

    res.sendStatus(200);
    console.log("Received workoutId:", workoutId);
    console.log("Received exerciseId:", exerciseId);
    console.log("Received sets:", sets);
  } catch (error) {
    console.error("Error saving ExerciseLog:", error);
    res.sendStatus(500);
  }
});

// Route to create a new workout
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

// Route to fetch a single workout by ID
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

// Route to fetch a single exercise log by ID
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

// Route to fetch a single exercise by ID
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

// Route to fetch exercise logs for a workout
router.get("/exercise-log/:workoutId", async (req, res) => {
  const workoutId = req.params.workoutId;

  try {
    const workout = await Workout.findById(workoutId);

    const exerciseLogs = await ExerciseLog.find({
      workoutId: workout._id,
    }).populate("exerciseId");

    console.log("Fetched exerciseLogs:", exerciseLogs);
    res.json(exerciseLogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching exercise logs." });
  }
});

// Route to finish a workout
router.put("/finish-workout/:workoutId", isLoggedIn, async (req, res) => {
  const workoutId = req.params.workoutId;
  const { workoutId: _workoutId, exercises, notes } = req.body;

  try {
    // Store the exercise logs in the database
    const exerciseLogIds = [];
    for (const exercise of exercises) {
      const exerciseLog = new ExerciseLog({
        workoutId,
        exerciseId: exercise.exerciseId,
        sets: exercise.sets,
      });

      const savedExerciseLog = await exerciseLog.save();
      exerciseLogIds.push(savedExerciseLog._id);
    }

    // Retrieve the workout and exercise logs associated with the workoutId
    const workout = await Workout.findById(workoutId);

    if (!workout) {
      return res.status(404).send("Workout not found");
    }

    // Update the workout with the exerciseLogIds, total weight, and set completed to true
    workout.exerciseLogs = exerciseLogIds;
    workout.totalWeight = calculateTotalWeight(exercises);
    workout.completed = true;
    workout.notes = notes;

    const updatedWorkout = await workout.save();

    console.log("Updated workout:", updatedWorkout);

    // Send the updated workout as a response
    res.status(200).send(updatedWorkout);
  } catch (error) {
    console.error("Error finishing workout:", error);
    res.sendStatus(500);
  }
});

module.exports = router;
