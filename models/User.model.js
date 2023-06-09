const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: false,
  },
  weight: {
    type: Number,
    required: false,
  },
  height: {
    type: Number,
    required: false,
  },
  gender: {
    type: String,
    required: false,
    enum: ["male", "female", "other"],
  },
  profilePic: {
    type: String,
    required: false,
    default:
      "https://res.cloudinary.com/dyedhqbhg/image/upload/v1683033609/k1jhiockyxlqwtqpo35e.png",
  },
  bio: {
    type: String,
    required: false,
  },
  // This is the array of workouts that the user has created
  workouts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Workout",
    },
  ],
});

const User = model("User", userSchema);

module.exports = User;
