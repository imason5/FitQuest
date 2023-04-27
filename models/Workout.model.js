const { Schema, model } = require("mongoose");

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
