const { Schema, model } = require("mongoose");

const setSchema = new Schema({
  reps: {
    type: Number,
    default: 0,
  },
  weight: {
    type: Number,
    default: 0,
  },
  pointsPerKg: {
    type: Number,
    default: 0,
  },
});

const exerciseLogSchema = new Schema({
  workoutId: {
    type: Schema.Types.ObjectId,
    ref: "Workout",
    required: true,
  },
  exerciseId: {
    type: Schema.Types.ObjectId,
    ref: "Exercise",
    // required: true,
  },
  sets: [setSchema],
  distance: {
    type: Number,
    default: 0,
  },
  duration: {
    type: Number,
    default: 0,
  },
});
const ExerciseLog = model("ExerciseLog", exerciseLogSchema);
module.exports = ExerciseLog;
