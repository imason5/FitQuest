document.addEventListener("DOMContentLoaded", async () => {
  // ********************
  // Constants
  // ********************

  const WORKOUT_NAME = "My Workout"; // TODO: Change this to be dynamic, although it doesn't get used anywhere yet.

  // ********************
  // GLOBAL VARIABLES
  // ********************

  let workoutId;

  let workoutData = {
    workoutId: null,
    exercises: [],
  };

  // ********************
  // DOM manipulation functions
  // ********************

  // Displays search results of the exercises. Creates a div for each exercise and appends it to the searchResults div in workout.ejs.
  function displaySearchResults(exercises) {
    const searchResults = document.getElementById("searchResults");
    searchResults.innerHTML = "";

    for (const exercise of exercises) {
      if (!exercise) {
        console.error("No exercises found");
        continue;
      }
      const div = document.createElement("div");
      div.classList.add("search-result");

      // Add data attributes to the div to store the exercise id, type and difficulty for later use
      div.innerHTML = `
        <span >${exercise.name}</span>
        <button class="add-exercise" data-id="${exercise._id}" data-type="${exercise.type}" data-difficulty="${exercise.difficulty}">+</button>
        <button class="more-info" data-equipment="${exercise.equipment}" data-instructions="${exercise.instructions}">&#8505;</button>
      `;
      searchResults.appendChild(div);
    }
  }

  // Displays a new card in the current workout container with the given exercise name. Uses the exercise-card-template in the HTML file.
  function displayCurrentWorkoutExercise(exerciseId, exerciseName) {
    const currentWorkout = document.getElementById("currentWorkout");
    const template = document.getElementById("exercise-card-template");

    const card = template.content.cloneNode(true).querySelector(".card");

    const title = card.querySelector(".card-title");
    title.textContent = `${exerciseName}`;

    const removeButton = document.createElement("button");
    removeButton.classList.add("remove-exercise");
    removeButton.textContent = "Remove";
    card.querySelector(".card-actions").appendChild(removeButton);

    currentWorkout.appendChild(card);
    return card;
  }

  // Modal for showing exercise instructions and equipment
  function displayMoreInfoModal(equipment, instructions) {
    // Create the modal container
    const modal = document.createElement("div");
    modal.classList.add("modal");

    // Create the modal content container
    const modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");

    // Add the equipment and instructions to the modal content
    modalContent.innerHTML = `
    <h3>Instructions</h3>
    <p>${instructions}</p>
    <p><b>Equipment Needed: </b>${
      equipment.replace("_", " ").charAt(0).toUpperCase() +
      equipment.replace("_", " ").slice(1)
    }</p>

    <button class="close-modal">Close</button>
    `;

    modal.appendChild(modalContent);

    document.body.appendChild(modal);

    document.querySelector(".close-modal").addEventListener("click", () => {
      document.body.removeChild(modal);
    });
  }

  // Handles adding an exercise to the workoutData object and displaying it in the current workout section.
  // TODO: Refactor this function
  function handleAddExercise(e) {
    if (e.target.classList.contains("add-exercise")) {
      const exerciseId = e.target.dataset.id; // Get the exercise id from the data-id attribute which we added to the button in displaySearchResults.
      const exerciseName = e.target.previousElementSibling.textContent; // Get the exercise name from the previous sibling element's textContent, which is the exercise name.
      const exerciseType = e.target.dataset.type; // Added to be used if we are going to implement features for cardio types.
      const exerciseDifficulty = e.target.dataset.difficulty;
      const baseScore = getBaseScore(exerciseDifficulty); // Get the base score for the exercise based on its difficulty.

      // Add the exercise to the workoutData object, can be updated and then be used to send to the API to create a new workout.
      workoutData.exercises.push({
        exerciseId,
        sets: [],
        type: exerciseType,
        difficulty: exerciseDifficulty,
        baseScore: baseScore,
        points: 0,
      });

      // Display the exercise in the current workout container
      const newExerciseCard = displayCurrentWorkoutExercise(
        exerciseId,
        exerciseName
      );
      newExerciseCard.addEventListener("input", (event) => {
        // Add an event listener to the new exercise card to listen for changes to the sets, for every time the user changes the weight or reps input.
        if (
          // If statement not strictly necessary, added in case cardio exercises are implemented.
          event.target.classList.contains("weight-input") ||
          event.target.classList.contains("reps-input")
        ) {
          // Get the updated sets
          const setRows = newExerciseCard.querySelectorAll(".set-row");
          const sets = [];

          for (const setRow of setRows) {
            const weightInput = setRow.querySelector(".weight-input");
            const repsInput = setRow.querySelector(".reps-input");

            const weight = parseFloat(weightInput.value) || 0;
            const reps = parseInt(repsInput.value) || 0;

            const pointsPerKg = getBaseScore(exerciseDifficulty);
            sets.push({
              weight: weight,
              reps: reps,
              pointsPerKg: pointsPerKg,
            });
          }

          // Find the card index in the current workout by finding the index of the card in the current workout container's children. Using Array.from to convert the HTMLCollection to an array in order to use indexOf.
          const currentWorkout = document.getElementById("currentWorkout");
          const cardIndex = Array.from(currentWorkout.children).indexOf(
            newExerciseCard
          );

          // Update the sets in the workoutData object
          workoutData.exercises[cardIndex].sets = sets;
        }
      });
    }
  }

  // Displays the workout summary modal, adds a notes input for the user, and calls the finishWorkout function when the user clicks the "Finished" button.
  // TODO: Refactor this function
  function displayWorkoutSummaryModal() {
    const modal = document.createElement("div");
    modal.classList.add("modal");

    const modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");

    modalContent.innerHTML = `
      <h3>Workout Summary</h3>
      <p>Notes:</p>
      <textarea id="workout-notes"></textarea>
      <button class="save-notes close-modal">Finished</button>
    `;

    modal.appendChild(modalContent);

    document.body.appendChild(modal);

    document
      .querySelector(".save-notes")
      .addEventListener("click", async () => {
        const notes = document.getElementById("workout-notes").value;
        workoutData.notes = notes; // Add the notes to the workout data
        const workout = await finishWorkout(workoutId, workoutData);
        if (workout) {
          // Fetch the exercise names
          const exerciseNamesPromises = workoutData.exercises.map((exercise) =>
            getExerciseNameById(exercise.exerciseId)
          );
          const exerciseNames = await Promise.all(exerciseNamesPromises);

          // Generate the exercise list HTML
          let exerciseListHTML = "";
          console.log("Exercises:", workoutData.exercises);
          let totalWorkoutPoints = 0;
          workoutData.exercises.forEach((exercise, index) => {
            const exerciseName = exerciseNames[index];

            exerciseListHTML += `
            <h4>Exercise ${index + 1}: ${exerciseName}</h4>
            <table>
              <tr>
                <th>Set</th>
                <th>kg</th>
                <th>reps</th>
                <th>Points</th>
              </tr>`;

            // Calculate the total points for the exercise
            exercise.sets.forEach((set, setIndex) => {
              const setPoints = set.weight * set.reps * set.pointsPerKg;
              totalWorkoutPoints += setPoints;
              exerciseListHTML += `
                  <tr>
                    <td>${setIndex + 1}</td>
                    <td>${set.weight}</td>
                    <td>${set.reps}</td>
                    <td>${setPoints}</td>
                  </tr>`;
            });

            exerciseListHTML += `</table>`;
          });

          // Update the modal content with the workout summary and exercise list
          modalContent.innerHTML = `
          <h3>Workout Summary</h3>
          <p>Total Weight: ${workout.totalWeight} kg</p>
          <p>Total Points: ${totalWorkoutPoints}</p>
          ${exerciseListHTML}
          <button class="close-modal">Close</button>
        `;

          document
            .querySelector(".close-modal")
            .addEventListener("click", () => {
              document.body.removeChild(modal);
              window.location.href = "/profile"; // Redirect to profile page
            });
        }
      });
  }

  // ********************
  // API interaction functions
  // ********************

  // Interacts with onSearchFormSubmit to fetch exercises from the API based on the search query.
  async function fetchExercises(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }

  // Remove the exercise from the workoutData object and the DOM.
  async function handleRemoveExercise(e) {
    // Find the card and its index in the current workout
    const currentWorkout = document.getElementById("currentWorkout");
    const card = e.target.closest(".card");
    const cardIndex = Array.from(currentWorkout.children).indexOf(card);

    // Remove the exercise from the workoutData object
    workoutData.exercises.splice(cardIndex, 1);

    // Remove the card from the DOM
    currentWorkout.removeChild(card);
  }

  // Sends a PUT request to the API to finish the workout. Also calculates total points for the workout.
  // TODO: Refactor this function (total points calculation should probably be done elsewhere)
  async function finishWorkout(workoutId, workoutData) {
    if (!workoutId) {
      console.error("Workout ID is not set. Unable to finish workout.");
      return;
    }

    // Calculate the total points for the workout
    let totalPoints = 0;
    for (const exercise of workoutData.exercises) {
      let exercisePoints = 0;

      exercise.sets.forEach((set) => {
        exercisePoints += set.weight * set.reps * set.pointsPerKg;
      });

      exercise.points = exercisePoints;
      totalPoints += exercise.points;
    }
    workoutData.totalPoints = totalPoints;

    console.log("Sending workoutData to server:", workoutData);
    const response = await fetch(`/workout/finish-workout/${workoutId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(workoutData),
    });

    if (response.ok) {
      console.log("Workout finished");
      const workout = await response.json();
      return workout;
    } else {
      console.error("Error finishing workout");
      return null;
    }
  }

  // Fetches an exercise by its ID and returns its name.
  async function getExerciseNameById(exerciseId) {
    try {
      const response = await fetch(`/workout/get-exercise/${exerciseId}`);
      if (response.ok) {
        const exercise = await response.json();
        return exercise.name;
      } else {
        console.error(`Error fetching exercise with ID ${exerciseId}`);
        return null;
      }
    } catch (error) {
      console.error(`Error fetching exercise with ID ${exerciseId}:`, error);
      return null;
    }
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
      workoutData.workoutId = workoutId;
      console.log("Workout ID:", workoutId);
      return true;
    } else {
      console.error("Error creating workout");
      return false;
    }
  }
  // ********************
  // HELPER FUNCTIONS
  // ********************

  // Gets the base score for an exercise based on its difficulty
  function getBaseScore(difficulty, minPoints = 0) {
    switch (difficulty) {
      case "beginner":
        return 0.1;
      case "intermediate":
        return 0.25;
      case "expert":
        return 0.5;
      default:
        console.error(`Invalid difficulty: ${difficulty}`);
        return 0.1;
    }
  }
  // ********************
  // Event handlers
  // ********************

  async function onSearchFormSubmit(e) {
    e.preventDefault();
    const search = document.getElementById("search").value;
    const exercises = await fetchExercises(
      `/workout/search?search=${encodeURIComponent(search)}`
    );
    displaySearchResults(exercises);
  }

  function onAddExerciseButtonClick(e) {
    if (e.target.classList.contains("add-exercise")) {
      handleAddExercise(e);
    }
  }

  async function onRemoveExerciseButtonClick(e) {
    if (e.target.classList.contains("remove-exercise")) {
      await handleRemoveExercise(e);
    }
  }

  function onMoreInfoButtonClick(event) {
    if (event.target.classList.contains("more-info")) {
      const equipment = event.target.dataset.equipment;
      const instructions = event.target.dataset.instructions;
      displayMoreInfoModal(equipment, instructions);
    }
  }

  async function onFinishWorkoutButtonClick() {
    displayWorkoutSummaryModal(workoutId, workoutData);
  }

  // ********************
  // Event listeners
  // ********************
  document
    .getElementById("searchForm")
    .addEventListener("submit", onSearchFormSubmit);

  document.addEventListener("click", onAddExerciseButtonClick);
  document.addEventListener("click", onMoreInfoButtonClick);
  document.addEventListener("click", onRemoveExerciseButtonClick);

  document
    .getElementById("finish-workout")
    .addEventListener("click", onFinishWorkoutButtonClick);

  // ********************
  // Initialization
  // ********************

  (async () => {
    await createNewWorkout(WORKOUT_NAME);
  })();
});
