document.addEventListener("DOMContentLoaded", async () => {
  // ********************
  // DOM manipulation functions
  // ********************

  function displaySearchResults(exercises) {
    console.log("Exercises array:", exercises);
    const searchResults = document.getElementById("searchResults");
    searchResults.innerHTML = "";

    for (const exercise of exercises) {
      if (!exercise) {
        console.error("No exercises found");
        continue;
      }

      const div = document.createElement("div");
      div.innerHTML = `
      <span>${exercise.name}</span>
      <button class="add-exercise" data-id="${exercise._id}">Add to workout</button>
    `;
      searchResults.appendChild(div);
    }
  }

  function displayWorkoutExercises(exerciseLogs) {
    console.log("Displaying workout exercises:", exerciseLogs);
    const workoutExercises = document.getElementById("workoutExercises");
    workoutExercises.innerHTML = "";

    for (const exerciseLog of exerciseLogs) {
      const exerciseId = exerciseLog.exerciseId._id;
      const exerciseName = exerciseLog.exerciseId.name;
      const sets = exerciseLog.sets;
      const reps = exerciseLog.reps;
      const weight = exerciseLog.weight;

      const div = document.createElement("div");
      div.setAttribute("data-exercise-id", exerciseId);
      div.innerHTML = `
      <span>${exerciseName}: ${sets} sets x ${reps} reps @ ${weight} lbs</span>
    `;
      workoutExercises.appendChild(div);
    }
  }

  function displayCurrentWorkoutExercise(exerciseId, exerciseName) {
    const currentWorkout = document.getElementById("currentWorkout");
    const template = document.getElementById("exercise-card-template");

    // Create a copy of the template
    const card = template.content.cloneNode(true).querySelector(".card");

    // Update the card title with exercise name
    const title = card.querySelector(".card-title");
    title.textContent = `${exerciseName}`;

    // Append the card to the current workout container
    currentWorkout.appendChild(card);
  }
  let workoutId;

  // ********************
  // API interaction functions
  // ********************

  async function createNewWorkout(name) {
    const response = await fetch("/workout/create-workout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        workoutName: name,
      }),
    });

    if (response.ok) {
      const workout = await response.json();
      workoutId = workout._id;
      console.log("Workout ID:", workoutId);
      return true;
    } else {
      console.error("Error creating workout");
      return false;
    }
  }

  // ********************
  // Event listeners
  // ********************

  document
    .getElementById("searchForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const search = document.getElementById("search").value;
      const response = await fetch(
        `/workout/search?search=${encodeURIComponent(search)}`
      );
      const exercises = await response.json();
      displaySearchResults(exercises);
    });

  // Event listener for button to add exercise to workout
  document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("add-exercise")) {
      const exerciseId = e.target.dataset.id;
      const sets = 3;
      const reps = 10;
      const weight = 100;

      console.log("Workout ID before sending request:", workoutId);

      const response = await fetch("/workout/exercise-log", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workoutId,
          exerciseId,
          sets,
          reps,
          weight,
        }),
      });

      if (response.ok) {
        console.log("Exercise added to current workout");
        const exerciseName = e.target.previousElementSibling.textContent;
        displayCurrentWorkoutExercise(
          exerciseId,
          exerciseName,
          sets,
          reps,
          weight
        );
      } else {
        console.error("Error adding exercise to current workout");
      }
    }
  });
  // Event listener for button to finish workout
  document
    .getElementById("finish-workout")
    .addEventListener("click", async () => {
      console.log("Finish Workout button clicked");
      const response = await fetch(`/workout/finish-workout/${workoutId}`, {
        method: "PUT",
      });

      if (response.ok) {
        console.log("Workout finished");

        // Fetch the workout and its exercise logs
        const workoutResponse = await fetch(
          `/workout/get-workout/${workoutId}`
        );
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
    });

  // ********************
  // Initialization
  // ********************

  const workoutName = "My Workout";

  (async () => {
    await createNewWorkout(workoutName);
  })();
});
