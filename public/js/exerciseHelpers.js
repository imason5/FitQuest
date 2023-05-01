const path = require("path");
const Exercise = require(path.join(__dirname, "../../models/Exercise.model"));

async function storeExercise(apiData, searchTerm) {
  // Transform the API data into a format that the database can understand
  const transformedData = transformExerciseData(apiData);

  // Check to see if an exercise with the same name and muscle already exists in the database
  const existingExercise = await Exercise.findOne({
    name: transformedData.name,
    muscle: transformedData.muscle,
  });
  let exerciseId;

  // If exercise already exists, return its ID.
  if (existingExercise) {
    exerciseId = existingExercise._id;
  } else {
    const newExercise = await Exercise.create(transformedData);
    exerciseId = newExercise._id;
  }

  return exerciseId;
}

//converts the API data into a format that the database can understand
function transformExerciseData(apiData) {
  return {
    name: apiData.name,
    type: apiData.type,
    muscle: apiData.muscle,
    equipment: apiData.equipment,
    difficulty: apiData.difficulty,
    instructions: apiData.instructions,
  };
}

module.exports = {
  storeExercise,
};
