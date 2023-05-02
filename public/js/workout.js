document.addEventListener("DOMContentLoaded", async () => {
  // ********************
  // DOM manipulation functions
  // ********************

  let workoutId;

  // Displays search results in the HTML page. Creates a new div element for each exercise in the exercises array, with a name and a button to add the exercise to the current workout.
  function displaySearchResults(exercises) {
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

  // Displays a new card in the current workout container with the given exercise name. Uses the exercise-card-template in the HTML file.
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

  // Will handle the Finish Workout logic
  async function finishWorkout(workoutId) {
    if (!workoutId) {
      console.error("Workout ID is not set. Unable to finish workout.");
      return;
    }

    console.log("Finish Workout button clicked");

    const exerciseCards = document.querySelectorAll("#currentWorkout .card");

    for (const exerciseCard of exerciseCards) {
      const exerciseId = exerciseCard.getAttribute("data-exercise-id");
      const setRows = exerciseCard.querySelectorAll(".set-row");
      const sets = [];

      for (const setRow of setRows) {
        const weightInput = setRow.querySelector(".weight-input");
        const repsInput = setRow.querySelector(".reps-input");

        sets.push({
          weight: parseFloat(weightInput.value) || 0,
          reps: parseInt(repsInput.value) || 0,
        });
      }

      console.log("Sets before sending request:", sets);

      const response = await fetch("/workout/exercise-log", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workoutId,
          exerciseId,
          sets,
        }),
      });

      if (!response.ok) {
        console.error("Error adding exercise to current workout");
      }
    }

    console.log("Workout finished");
  }

  // ********************
  // API interaction functions
  // ********************

  // Handles search form submission. Gets the search term from the input field and calls the fetchExercises function to get the exercises from the API. Then calls the displaySearchResults function to display the results.
  async function searchExercises(e) {
    e.preventDefault();
    const search = document.getElementById("search").value;
    const exercises = await fetchExercises(
      `/workout/search?search=${encodeURIComponent(search)}`
    );
    displaySearchResults(exercises);
  }

  // Fetches exercises from the API. Returns an array of exercises.
  async function fetchExercises(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }

  // Sends a POST request to create a new workout with the given name and sets workoutId to the created workout's ID.
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

  // Handles adding an exercise to the current workout. Gets the exercise ID from the button's data-id attribute. Gets the sets from the input fields in the DOM. Sends a POST request to the API to add the exercise to the current workout. If the request is successful, calls the displayCurrentWorkoutExercise function to display the exercise in the current workout container.
  async function handleAddExercise(e) {
    const exerciseId = e.target.dataset.id; // Get the exercise ID from the button's data-id attribute.
    const setElements = document.querySelectorAll(".set-row");
    const sets = [];
    for (const setElement of setElements) {
      const weightInput = setElement.querySelector(".weight-input");
      const repsInput = setElement.querySelector(".reps-input");

      sets.push({
        weight: parseFloat(weightInput.value) || 0,
        reps: parseInt(repsInput.value) || 0,
      });
    }

    console.log("Exercise ID:", exerciseId);
    console.log("Workout ID:", workoutId);
    console.log("Sets before sending request:", sets);

    const response = await fetch("/workout/exercise-log", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        workoutId,
        exerciseId,
        sets,
      }),
    });

    if (response.ok) {
      const exerciseName = e.target.previousElementSibling.textContent; // Get the exercise name from the button's previous sibling. This is the span element that contains the exercise name. This is a bit hacky, but it works.
      displayCurrentWorkoutExercise(exerciseId, exerciseName, sets);
    } else {
      console.error("Error adding exercise to current workout");
    }
  }

  // ********************
  // Event listeners
  // ********************

  // Event listener for search form
  document
    .getElementById("searchForm")
    .addEventListener("submit", searchExercises);

  // Event listener for button to add exercise to workout
  document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("add-exercise")) {
      await handleAddExercise(e);
    }
  });

  // Event listener for button to finish workout
  document
    .getElementById("finish-workout")
    .addEventListener("click", async () => {
      await finishWorkout(workoutId);
    });

  // ********************
  // Initialization
  // ********************

  const now = new Date();
  const formattedDate = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
  const workoutName = `My Workout - ${formattedDate}`;

  (async () => {
    await createNewWorkout(workoutName);
  })();
});
