const { Schema, model } = require("mongoose");

// ExerciseLog model should store the specific details of a user's performance in a particular workout session.
const exerciseLogSchema = new Schema({
  workoutId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workout",
    required: true,
  },
  exerciseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exercise",
    required: true,
  },
  sets: {
    type: Number,
    required: true,
  },
  reps: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    default: 0,
  },
  distance: {
    type: Number,
    default: 0,
  },
  duration: {
    type: Number,
    default: 0,
  },
  points: {
    type: Number,
    default: 0,
  },
});
const ExerciseLog = model("ExerciseLog", exerciseLogSchema);
module.exports = ExerciseLog;
