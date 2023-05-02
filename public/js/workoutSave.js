export async function finishWorkout(workoutId, displayWorkoutExercises) {
  console.log("Finish Workout button clicked");
  const response = await fetch(`/workout/finish-workout/${workoutId}`, {
    method: "PUT",
  });

  if (response.ok) {
    console.log("Workout finished");

    // Fetch the workout and its exercise logs
    const workoutResponse = await fetch(`/workout/get-workout/${workoutId}`);
    const exerciseLogsResponse = await fetch(
      `/workout/exercise-log/${workoutId}`
    );
    console.log("exerciseLogsResponse:", exerciseLogsResponse);

    if (workoutResponse.ok && exerciseLogsResponse.ok) {
      const exerciseLogs = await exerciseLogsResponse.json();
      displayWorkoutExercises(exerciseLogs);
    } else {
      console.error("Error fetching workout or exercise logs");
    }
  } else {
    console.error("Error finishing workout");
  }
}
