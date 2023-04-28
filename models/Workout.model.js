const { Schema, model } = require("mongoose");

const workoutSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
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
      type: Schema.Types.ObjectId,
      ref: "ExerciseLog",
    },
  ],
});

const Workout = model("Workout", workoutSchema);

module.exports = Workout;
