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
  const { workoutId, exerciseId, sets, reps, weight } = req.body;

  const exerciseLog = new ExerciseLog({
    workoutId,
    exerciseId,
    sets,
    reps,
    weight,
  });

  try {
    const savedExerciseLog = await exerciseLog.save();

    await Workout.findByIdAndUpdate(workoutId, {
      $push: { exercises: savedExerciseLog._id },
    });

    res.sendStatus(200);
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

  try {
    const updatedWorkout = await Workout.findByIdAndUpdate(
      workoutId,
      {
        completed: true,
      },
      { new: true }
    );
    console.log("Updated Workout:", updatedWorkout);
    res.sendStatus(200);
  } catch (error) {
    console.error("Error finishing workout:", error);
    res.sendStatus(500);
  }
});

// Route to fetch a workout along with its exercise logs
router.get("/workout-with-logs/:workoutId", async (req, res) => {
  const workoutId = req.params.workoutId;

  try {
    const workout = await Workout.findById(workoutId).populate("exerciseLogs");
    res.status(200).json(workout);
  } catch (error) {
    console.error("Error fetching workout with exercise logs:", error);
    res.sendStatus(500);
  }
});

// Route to fetch the most recent workout - for testing
// const getMostRecentWorkout = async () => {
//   try {
//     const workout = await Workout.findOne()
//       .sort({ createdAt: -1 })
//       .populate("exerciseLogs");
//     return workout;
//   } catch (error) {
//     console.error("Error fetching the most recent workout:", error);
//   }
// };

// (async () => {
//   const mostRecentWorkout = await getMostRecentWorkout();
//   console.log("Most Recent Workout:", mostRecentWorkout);
// })();

module.exports = router;
