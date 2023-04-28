const path = require("path");
const Exercise = require(path.join(__dirname, "../../models/Exercise.model"));

async function storeExercise(apiData) {
  const transformedData = transformExerciseData(apiData);

  const existingExercise = await Exercise.findOne({
    name: transformedData.name,
  });
  let exerciseId;

  if (existingExercise) {
    exerciseId = existingExercise._id;
  } else {
    const newExercise = await Exercise.create(transformedData);
    exerciseId = newExercise._id;
  }

  return exerciseId;
}

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
