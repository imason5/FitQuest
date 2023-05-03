const calculateTotalWeight = (exerciseLogs) => {
  let totalWeight = 0;

  exerciseLogs.forEach((exerciseLog) => {
    exerciseLog.sets.forEach((set) => {
      totalWeight += set.weight * set.reps;
    });
  });

  return totalWeight;
};

const calculateTotalPoints = (exerciseLogs) => {
  let totalPoints = 0;

  exerciseLogs.forEach((exerciseLog) => {
    exerciseLog.sets.forEach((set) => {
      totalPoints += set.weight * set.reps * set.pointsPerKg;
    });
  });

  return totalPoints;
};

module.exports = { calculateTotalWeight, calculateTotalPoints };
