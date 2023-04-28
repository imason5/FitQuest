const { Schema, model } = require("mongoose");

const exerciseSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: [
      "cardio",
      "olympic_weightlifting",
      "plyometrics",
      "powerlifting",
      "strength",
      "stretching",
      "strongman",
    ],
  },
  muscle: {
    type: String,
    required: true,
    enum: [
      "abdominals",
      "abductors",
      "adductors",
      "biceps",
      "calves",
      "chest",
      "forearms",
      "glutes",
      "hamstrings",
      "lats",
      "lower_back",
      "middle_back",
      "neck",
      "quadriceps",
      "traps",
      "triceps",
    ],
  },
  equipment: {
    type: String,
  },
  difficulty: {
    type: String,
    required: true,
    enum: ["beginner", "intermediate", "expert"],
  },
  instructions: {
    type: String,
    required: true,
  },
});

const Exercise = model("Exercise", exerciseSchema);

module.exports = Exercise;
