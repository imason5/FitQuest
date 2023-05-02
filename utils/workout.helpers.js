const calculateTotalWeight = (exerciseLogs) => {
  let totalWeight = 0;

  exerciseLogs.forEach((exerciseLog) => {
    exerciseLog.sets.forEach((set) => {
      totalWeight += set.weight * set.reps;
    });
  });

  return totalWeight;
};

module.exports = { calculateTotalWeight };
