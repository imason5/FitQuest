document.addEventListener("DOMContentLoaded", async () => {
  // ********************
  // DOM manipulation functions
  // ********************

  let workoutId;

  // Object to store the current workout data
  let workoutData = {
    workoutId: null,
    exercises: [],
  };

  // Displays search results in the HTML page. Creates a new div element for each exercise in the exercises array, with a name and a button to add the exercise to the current workout. The button has data attributes to store the exercise ID, type, and difficulty, so that we can use them later when adding the exercise to the workout.
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
      div.innerHTML = `
        <span >${exercise.name}</span>
        <button class="add-exercise" data-id="${exercise._id}" data-type="${exercise.type}" data-difficulty="${exercise.difficulty}">+</button>
        <button class="more-info" data-equipment="${exercise.equipment}" data-instructions="${exercise.instructions}">&#8505;</button>
      `;
      searchResults.appendChild(div);
    }
  }

  // Displays a modal with more information about the exercise. Creates a new div element with the equipment and instructions for the exercise. Uses the exercise-card-template in the HTML file.
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

    // Add the modal content to the modal container
    modal.appendChild(modalContent);

    // Add the modal to the body
    document.body.appendChild(modal);

    // Add event listener to close the modal
    document.querySelector(".close-modal").addEventListener("click", () => {
      document.body.removeChild(modal);
    });
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

    // Add the remove button to the card
    const removeButton = document.createElement("button");
    removeButton.classList.add("remove-exercise");
    removeButton.textContent = "Remove";
    card.querySelector(".card-actions").appendChild(removeButton);

    // Append the card to the current workout container
    currentWorkout.appendChild(card);
  }
  // Displays the workout summary modal. Creates a new div element with a textarea for notes and a button to save the notes. When the button is clicked, the workout is finished by calling the finishWorkout function. When the workout is finished, the modal content is updated with the workout summary.
  function displayWorkoutSummaryModal() {
    // Create the modal container
    const modal = document.createElement("div");
    modal.classList.add("modal");

    // Create the modal content container
    const modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");

    // Add the input fields to the modal content
    modalContent.innerHTML = `
      <h3>Workout Summary</h3>
      <p>Notes:</p>
      <textarea id="workout-notes"></textarea>
      <button class="save-notes close-modal">Finished</button>
    `;

    // Add the modal content to the modal container
    modal.appendChild(modalContent);

    // Add the modal to the body
    document.body.appendChild(modal);

    document
      .querySelector(".save-notes")
      .addEventListener("click", async () => {
        const notes = document.getElementById("workout-notes").value;
        workoutData.notes = notes; // Update the workoutData object with the notes
        const workout = await finishWorkout(workoutId, workoutData);
        if (workout) {
          // Update the modal content with the workout summary
          modalContent.innerHTML = `
            <h3>Workout Summary</h3>
            <p>Total Duration: ${workout.totalDuration} minutes</p>
            <p>Total Weight: ${workout.totalWeight} lbs</p>
            <p>Total Distance: ${workout.totalDistance} miles</p>
            <p>Total Points: ${workout.totalPoints}</p>
            <button class="close-modal">Close</button>
          `;

          // Add event listener to close the modal
          document
            .querySelector(".close-modal")
            .addEventListener("click", () => {
              document.body.removeChild(modal);
            });
        }
      });
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
      workoutData.workoutId = workoutId;
      console.log("Workout ID:", workoutId);
      return true;
    } else {
      console.error("Error creating workout");
      return false;
    }
  }

  // Handles adding an exercise to the current workout. Gets the exercise ID from the button's data-id attribute. Gets the sets from the input fields in the DOM. Sends a POST request to the API to add the exercise to the current workout. If the request is successful, calls the displayCurrentWorkoutExercise function to display the exercise in the current workout container.
  async function handleAddExercise(e) {
    if (e.target.classList.contains("add-exercise")) {
      const exerciseId = e.target.dataset.id;
      const exerciseName = e.target.previousElementSibling.textContent;
      const exerciseType = e.target.dataset.type; // Get the exercise type from the data-type attribute
      const exerciseDifficulty = e.target.dataset.difficulty; // Get the exercise difficulty from the data-difficulty attribute
      console.log("exerciseType:", exerciseType);
      console.log("exerciseDifficulty:", exerciseDifficulty);

      // Add the exercise to the workoutData object
      workoutData.exercises.push({
        exerciseId,
        sets: [],
        type: exerciseType, // Add the exercise type to the workoutData object
        difficulty: exerciseDifficulty, // Add the exercise difficulty to the workoutData object
      });

      // Display the exercise in the current workout container
      displayCurrentWorkoutExercise(exerciseId, exerciseName, exerciseType);

      // Attach an event listener to the last added card for changes in input fields
      const currentWorkout = document.getElementById("currentWorkout");
      const lastAddedCard = currentWorkout.lastElementChild;

      lastAddedCard.addEventListener("input", (event) => {
        if (exerciseType === "cardio") {
          console.log("Cardio exercise selected");
          // Add functionality for cardio exercises
        } else {
          // Existing functionality for non-cardio exercises
          if (
            event.target.classList.contains("weight-input") ||
            event.target.classList.contains("reps-input")
          ) {
            // Get the updated sets
            const setRows = lastAddedCard.querySelectorAll(".set-row");
            const sets = [];

            for (const setRow of setRows) {
              const weightInput = setRow.querySelector(".weight-input");
              const repsInput = setRow.querySelector(".reps-input");

              sets.push({
                weight: parseFloat(weightInput.value) || 0,
                reps: parseInt(repsInput.value) || 0,
              });
            }

            // Update the sets in the workoutData object
            workoutData.exercises[workoutData.exercises.length - 1].sets = sets;
          }
        }
      });
    }
  }

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

  // Sends a PUT request to the API to finish the workout. Returns the finished workout.
  async function finishWorkout(workoutId, workoutData) {
    if (!workoutId) {
      console.error("Workout ID is not set. Unable to finish workout.");
      return;
    }

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

  // Event listener for button for more info button
  document.addEventListener("click", (event) => {
    if (event.target.classList.contains("more-info")) {
      const equipment = event.target.dataset.equipment;
      const instructions = event.target.dataset.instructions;
      displayMoreInfoModal(equipment, instructions);
    }
  });

  // Event listener for button to remove exercise from workout
  document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("remove-exercise")) {
      await handleRemoveExercise(e);
    }
  });

  // Event listener for button to finish workout and show workout summary
  document
    .getElementById("finish-workout")
    .addEventListener("click", async () => {
      // Display the Workout Summary Modal and pass the workoutId and workoutData
      displayWorkoutSummaryModal(workoutId, workoutData);
    });
  // ********************
  // Initialization
  // ********************

  const workoutName = "My Workout";

  (async () => {
    await createNewWorkout(workoutName);
  })();
});
