const { Schema, model } = require("mongoose");

// Workout describes a workout session that consists of multiple ExerciseLog instances.
const workoutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  totalDuration: {
    type: Number,
    default: 0,
  },
  totalWeight: {
    type: Number,
    default: 0,
  },
  totalDistance: {
    type: Number,
    default: 0,
  },
  totalPoints: {
    type: Number,
    default: 0,
  },
  notes: {
    type: String,
    default: "",
  },
  exerciseLogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExerciseLog",
    },
  ],
});

const Workout = model("Workout", workoutSchema);

module.exports = Workout;
